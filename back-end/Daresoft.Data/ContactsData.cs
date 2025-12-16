using Dapper;
using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Daresoft.Core.Types;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
//using Org.BouncyCastle.Asn1.X509;

namespace Daresoft.Data
{
    public class ContactsData : IContactsData
    {
        private readonly IConnectionProvider connectionProvider;

        public ContactsData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public async Task<ContactModel> CreateAsync(ContactModel contact, int currentUserId)
        {
            int contactId = 0;

            using (var connection = await connectionProvider.OpenAsync())
            {
                string insertContactDataSql = @"            
                INSERT INTO Contact
                (
                    Name
                    ,MiddleName
                    ,LastName
                    ,OtherName
                    ,ContactTypeId
                    ,WorkEmail
                    ,WorkPhone
                    ,WorkPhoneExt
                    ,MobilePhone
                    ,IsSupplier
                    ,IsDeleted
                    ,CreatedDate
                    ,CreatedByUserId
                    ,LastModifiedDate
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @Name
                    ,@MiddleName
                    ,@LastName
                    ,@OtherName
                    ,@ContactTypeId
                    ,@WorkEmail
                    ,@WorkPhone
                    ,@WorkPhoneExt
                    ,@MobilePhone
                    ,@IsSupplier
                    ,@IsDeleted
                    ,GETUTCDATE()
                    ,@CreatedByUserId
                    ,GETUTCDATE()
                    ,@UpdatedByUserId
                )";                

                using (var trx = connection.BeginTransaction())
                {
                    // Insert contact data
                    contactId = connection.QuerySingle<int>(insertContactDataSql, new
                    {
                        contact.Name,
                        contact.MiddleName,
                        contact.LastName,
                        contact.OtherName,
                        contact.WorkEmail,
                        contact.WorkPhone,
                        contact.WorkPhoneExt,
                        contact.MobilePhone,
                        contact.ContactTypeId,
                        contact.IsSupplier,
                        IsDeleted = false,                        
                        CreatedByUserId = currentUserId,
                        UpdatedByUserId = currentUserId
                    }, trx);
                                        
                    trx.Commit();
                }
            }

            return await GetByIdAsync(contactId);
        }

        public async Task<bool> DeleteAsync(int contactId, int currentUserId)
        {
            int result = 0;

            //Hard delete
            using (var connection = await connectionProvider.OpenAsync())
            {
                string hardDeleteContactSql = @"DELETE Contact WHERE Id = @ContactId";

                using (var trx = connection.BeginTransaction())
                {                    
                    result = await connection.ExecuteAsync(hardDeleteContactSql, new { ContactId = contactId }, trx);
                    trx.Commit();
                }
            }

            return result == 1;
        }

        public async Task<List<ContactModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);
            
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    co.Id
                    ,co.Salutation
                    ,co.Name
                    ,co.MiddleName
                    ,co.LastName
                    ,co.OtherName
                    ,co.Title
                    ,co.HomeAddressLine1
                    ,co.HomeAddressLine2
                    ,co.HomeCity
                    ,co.HomeState
                    ,co.HomePostalCode
                    ,co.CountryId
                    ,co.WorkAddressLine1
                    ,co.WorkAddressLine2
                    ,co.WorkCity
                    ,co.WorkState
                    ,co.WorkPostalCode
                    ,co.WorkCountry
                    ,co.WorkEmail
                    ,co.HomeEmail
                    ,co.HomePhone
                    ,co.WorkPhone
                    ,co.WorkPhoneExt
                    ,co.MobilePhone
                    ,co.CompanyId
                    ,co.ContactTypeId
                    ,co.Notes
                    ,co.PreferredAddress
                    ,co.CompanyName
                    ,co.Website
                    ,co.PrimaryContactId
                    ,co.IsSupplier
                    ,co.IsDeleted
                    ,COUNT(*) OVER () TotalCount
                FROM Contact co
                WHERE @SearchText = '*'
                    OR CONCAT(co.Name,' ' ,co.MiddleName , ' ' , co.LastName, ' ' , co.OtherName) LIKE '%' + @SearchText + '%'
                ORDER BY UPPER(Name) 
                OFFSET (@Offset-1)*@Fetch ROWS
                FETCH NEXT @Fetch ROWS ONLY";

                if (String.IsNullOrEmpty(searchText))
                    searchText = "*";

                var result = await connection.QueryAsync<ContactModel>(sqlQuery, new
                {
                    Offset = offset,
                    Fetch = fetch,
                    SearchText = searchText
                });

                return result.ToList();
            }
        }

        public async Task<ContactModel> GetByIdAsync(int contactId)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"                    
                SELECT 
                    Id
                    ,Salutation
                    ,Name
                    ,MiddleName
                    ,LastName
                    ,OtherName
                    ,Title
                    ,HomeAddressLine1
                    ,HomeAddressLine2
                    ,HomeCity
                    ,HomeState
                    ,HomePostalCode
                    ,CountryId
                    ,WorkAddressLine1
                    ,WorkAddressLine2
                    ,WorkCity
                    ,WorkState
                    ,WorkPostalCode
                    ,WorkCountry
                    ,WorkEmail
                    ,HomeEmail
                    ,HomePhone
                    ,WorkPhone
                    ,WorkPhoneExt
                    ,MobilePhone
                    ,CompanyId
                    ,ContactTypeId
                    ,Notes
                    ,PreferredAddress
                    ,CompanyName
                    ,Website
                    ,PrimaryContactId
                    ,IsSupplier
                FROM Contact
                WHERE Id = @contactId
                ";
                var result = await connection.QueryAsync<ContactModel>(sqlQuery, new { contactId });
                return result.FirstOrDefault();
            }
        }

        public async Task<ContactModel> UpdateAsync(ContactModel contact, int currentUserId)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string updateContactDataSql = @"
                UPDATE Contact
                SET 
	                Name = @Name
	                ,MiddleName = @MiddleName
	                ,LastName = @LastName
	                ,OtherName = @OtherName
                    ,WorkEmail = @WorkEmail
                    ,WorkPhone = @WorkPhone
                    ,WorkPhoneExt = @WorkPhoneExt
                    ,MobilePhone = @MobilePhone
                    ,LastModifiedDate = GETUTCDATE()
                    ,UpdatedByUserId = @CurrentUserId
                WHERE Id = @Id";        

                using (var trx = connection.BeginTransaction())
                {
                    // Update contact data
                    await connection.ExecuteAsync(updateContactDataSql, new
                    {
                        contact.Id,
                        contact.Name,
                        contact.MiddleName,
                        contact.LastName,
                        contact.OtherName,
                        contact.WorkEmail,
                        contact.WorkPhone,
                        contact.WorkPhoneExt,
                        contact.MobilePhone,
                        CurrentUserId = currentUserId
                    }, trx);                    

                    trx.Commit();
                }
            }

            return await GetByIdAsync(contact.Id);
        }
    }
}