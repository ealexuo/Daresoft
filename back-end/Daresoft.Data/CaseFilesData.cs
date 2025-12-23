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
    public class CaseFilesData : ICaseFilesData
    {
        private readonly IConnectionProvider connectionProvider;

        public CaseFilesData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public async Task<CaseFileModel> CreateAsync(CaseFileModel contact, int currentUserId)
        {
            //int contactId = 0;

            //using (var connection = await connectionProvider.OpenAsync())
            //{
            //    string insertContactDataSql = @"            
            //    INSERT INTO Contact
            //    (
            //        Name
            //        ,MiddleName
            //        ,LastName
            //        ,OtherName
            //        ,ContactTypeId
            //        ,WorkEmail
            //        ,WorkPhone
            //        ,WorkPhoneExt
            //        ,MobilePhone
            //        ,IsSupplier
            //        ,IsDeleted
            //        ,CreatedDate
            //        ,CreatedByUserId
            //        ,LastModifiedDate
            //        ,UpdatedByUserId
            //    )
            //    OUTPUT INSERTED.Id
            //    VALUES(
            //        @Name
            //        ,@MiddleName
            //        ,@LastName
            //        ,@OtherName
            //        ,@ContactTypeId
            //        ,@WorkEmail
            //        ,@WorkPhone
            //        ,@WorkPhoneExt
            //        ,@MobilePhone
            //        ,@IsSupplier
            //        ,@IsDeleted
            //        ,GETUTCDATE()
            //        ,@CreatedByUserId
            //        ,GETUTCDATE()
            //        ,@UpdatedByUserId
            //    )";                

            //    using (var trx = connection.BeginTransaction())
            //    {
            //        // Insert contact data
            //        contactId = connection.QuerySingle<int>(insertContactDataSql, new
            //        {
            //            contact.Name,
            //            contact.MiddleName,
            //            contact.LastName,
            //            contact.OtherName,
            //            contact.WorkEmail,
            //            contact.WorkPhone,
            //            contact.WorkPhoneExt,
            //            contact.MobilePhone,
            //            contact.ContactTypeId,
            //            contact.IsSupplier,
            //            IsDeleted = false,                        
            //            CreatedByUserId = currentUserId,
            //            UpdatedByUserId = currentUserId
            //        }, trx);
                                        
            //        trx.Commit();
            //    }
            //}

            //return await GetByIdAsync(contactId);

            throw new NotImplementedException();
        }

        public async Task<bool> DeleteAsync(int contactId, int currentUserId)
        {
            //int result = 0;

            ////Hard delete
            //using (var connection = await connectionProvider.OpenAsync())
            //{
            //    string hardDeleteContactSql = @"DELETE Contact WHERE Id = @ContactId";

            //    using (var trx = connection.BeginTransaction())
            //    {                    
            //        result = await connection.ExecuteAsync(hardDeleteContactSql, new { ContactId = contactId }, trx);
            //        trx.Commit();
            //    }
            //}

            //return result == 1;

            throw new NotImplementedException();

        }

        public async Task<List<CaseFileModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);
            
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    cf.Id	
	                ,cf.CaseNumber
	                ,cf.Name
	                ,cf.Description
	                ,co.Id SupplierId
	                ,co.Name AS SupplierName
	                ,co.LastName AS SupplierLastName
	                ,wo.Id AS WorkflowId
	                ,wo.Name AS WorkflowName
	                ,wos.Id AS StatusId
	                ,wos.Name AS StatusName
                    ,COUNT(*) OVER () TotalCount
                FROM CaseFile cf 
                JOIN CaseFileWorkflow cfw on cf.Id = cfw.CaseFileId 
                JOIN Contact co ON co.Id = cf.SupplierContactId
                JOIN Workflow wo ON wo.Id = cfw.WorkflowId 
                JOIN WorkflowStatus wos ON wos.Id = cfw.WorkFlowStatusId
                WHERE @SearchText = '*'
                    OR cf.CaseNumber LIKE '%' + @SearchText + '%'
                    OR cf.Name LIKE '%' + @SearchText + '%'
                    OR cf.Description LIKE '%' + @SearchText + '%'
                    OR CONCAT(co.Name,' ', co.LastName) LIKE '%' + @SearchText + '%'
                ORDER BY UPPER(cf.CaseNumber) 
                OFFSET (@Offset-1)*@Fetch ROWS
                FETCH NEXT @Fetch ROWS ONLY";

                if (String.IsNullOrEmpty(searchText))
                    searchText = "*";

                var result = await connection.QueryAsync<CaseFileModel>(sqlQuery, new
                {
                    Offset = offset,
                    Fetch = fetch,
                    SearchText = searchText
                });

                return result.ToList();
            }
        }

        public async Task<CaseFileModel> GetByIdAsync(int contactId)
        {
            //using (var connection = await connectionProvider.OpenAsync())
            //{
            //    string sqlQuery = @"                    
            //    SELECT 
            //        Id
            //        ,Salutation
            //        ,Name
            //        ,MiddleName
            //        ,LastName
            //        ,OtherName
            //        ,Title
            //        ,HomeAddressLine1
            //        ,HomeAddressLine2
            //        ,HomeCity
            //        ,HomeState
            //        ,HomePostalCode
            //        ,CountryId
            //        ,WorkAddressLine1
            //        ,WorkAddressLine2
            //        ,WorkCity
            //        ,WorkState
            //        ,WorkPostalCode
            //        ,WorkCountry
            //        ,WorkEmail
            //        ,HomeEmail
            //        ,HomePhone
            //        ,WorkPhone
            //        ,WorkPhoneExt
            //        ,MobilePhone
            //        ,CompanyId
            //        ,ContactTypeId
            //        ,Notes
            //        ,PreferredAddress
            //        ,CompanyName
            //        ,Website
            //        ,PrimaryContactId
            //        ,IsSupplier
            //    FROM Contact
            //    WHERE Id = @contactId
            //    ";
            //    var result = await connection.QueryAsync<CaseFileModel>(sqlQuery, new { contactId });
            //    return result.FirstOrDefault();
            //}

            throw new NotImplementedException();

        }

        public async Task<CaseFileModel> UpdateAsync(CaseFileModel contact, int currentUserId)
        {
            //using (var connection = await connectionProvider.OpenAsync())
            //{
            //    string updateContactDataSql = @"
            //    UPDATE Contact
            //    SET 
            //     Name = @Name
            //     ,MiddleName = @MiddleName
            //     ,LastName = @LastName
            //     ,OtherName = @OtherName
            //        ,WorkEmail = @WorkEmail
            //        ,WorkPhone = @WorkPhone
            //        ,WorkPhoneExt = @WorkPhoneExt
            //        ,MobilePhone = @MobilePhone
            //        ,LastModifiedDate = GETUTCDATE()
            //        ,UpdatedByUserId = @CurrentUserId
            //    WHERE Id = @Id";        

            //    using (var trx = connection.BeginTransaction())
            //    {
            //        // Update contact data
            //        await connection.ExecuteAsync(updateContactDataSql, new
            //        {
            //            contact.Id,
            //            contact.Name,
            //            contact.MiddleName,
            //            contact.LastName,
            //            contact.OtherName,
            //            contact.WorkEmail,
            //            contact.WorkPhone,
            //            contact.WorkPhoneExt,
            //            contact.MobilePhone,
            //            CurrentUserId = currentUserId
            //        }, trx);                    

            //        trx.Commit();
            //    }
            //}

            //return await GetByIdAsync(contact.Id);

            throw new NotImplementedException();

        }
    }
}