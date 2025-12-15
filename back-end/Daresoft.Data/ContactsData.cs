using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Dapper;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Data;
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

        public Task<int> CreateAsync(ContactModel contact, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int contactId, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ContactModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);
            
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
                    ,IsDeleted
                    ,COUNT(*) OVER () TotalCount
                FROM Contact
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
                    ,IsDeleted
                FROM Contact
                WHERE Id = @contactId
                ";
                var result = await connection.QueryAsync<ContactModel>(sqlQuery, new { contactId });
                return result.FirstOrDefault();
            }
        }

        public Task<int> UpdateAsync(ContactModel contact, int currentUserId)
        {
            throw new NotImplementedException();
        }
    }
}