using Dapper;
using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Daresoft.Core.Types;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
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

        public async Task<CaseFileModel> CreateAsync(CaseFileModel caseFile, int currentUserId)
        {
            int caseFileId = 0;
            int caseFileWorkflowId = 0;

            using (var connection = await connectionProvider.OpenAsync())
            {
                string insertCaseFileDataSql = @"            
                INSERT INTO CaseFile
                (
                    CaseNumber
                    ,Name
                    ,Description
                    ,SupplierContactId
                    ,Url
                    ,IsActive
                    ,IsDeleted                    
                    ,CreatedDate
                    ,CreatedByUserId
                    ,LastModifiedDate
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @CaseNumber
                    ,@Name
                    ,@Description
                    ,@SupplierContactId
                    ,@Url
                    ,@IsActive
                    ,@IsDeleted
                    ,GETUTCDATE()
                    ,@CreatedByUserId
                    ,GETUTCDATE()
                    ,@UpdatedByUserId
                )";


                string insertCaseFileWorkflowDataSql = @"            
                INSERT INTO CaseFileWorkflow
                (
                    CaseFileId
                    ,WorkflowId
                    ,WorkflowStatusId
                    ,StartDate
                    ,EndDate
                    ,ExternalIdentifier                    
                    ,CreatedDate
                    ,CreatedByUserId
                    ,LastModifiedDate
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @CaseFileId
                    ,@WorkflowId
                    ,@WorkflowStatusId
                    ,@StartDate
                    ,@EndDate
                    ,@ExternalIdentifier
                    ,GETUTCDATE()
                    ,@CreatedByUserId
                    ,GETUTCDATE()
                    ,@UpdatedByUserId
                )";

                using (var trx = connection.BeginTransaction())
                {
                    // Insert casefile data
                    caseFileId = connection.QuerySingle<int>(insertCaseFileDataSql, new
                    {
                        caseFile.CaseNumber,
                        caseFile.Name,
                        caseFile.Description,
                        caseFile.SupplierContactId,
                        caseFile.Url,
                        caseFile.IsActive,
                        caseFile.IsDeleted,
                        CreatedByUserId = currentUserId,
                        UpdatedByUserId = currentUserId
                    }, trx);

                    // Insert casefileworkflow data
                    foreach(CaseFileWorkflowModel wf in caseFile.Workflows)
                    {
                        caseFileWorkflowId = connection.QuerySingle<int>(insertCaseFileWorkflowDataSql, new
                        {
                            caseFileId,
                            wf.WorkflowId,
                            wf.WorkflowStatusId,
                            wf.StartDate, 
                            wf.EndDate,
                            wf.ExternalIdentifier,
                            CreatedByUserId = currentUserId,
                            UpdatedByUserId = currentUserId
                        }, trx);
                    }

                    trx.Commit();
                }
            }

            return await GetByIdAsync(caseFileId);
        }

        public async Task<bool> DeleteAsync(int caseFileId, int currentUserId)
        {
            int result = 0;

            //Hard delete
            using (var connection = await connectionProvider.OpenAsync())
            {
                string hardDeleteDocumentSql = @"DELETE Document WHERE CaseFileId = @CaseFileId";
                string hardDeleteTaskSql = @"DELETE Task WHERE CaseFileId = @CaseFileId";
                string hardDeleteCaseFileWorkflowSql = @"DELETE CaseFileWorkflow WHERE CaseFileId = @CaseFileId";
                string hardDeleteCaseFileSql = @"DELETE CaseFile WHERE Id = @CaseFileId";

                using (var trx = connection.BeginTransaction())
                {
                    result = await connection.ExecuteAsync(hardDeleteDocumentSql, new { CaseFileId = caseFileId }, trx);
                    result = await connection.ExecuteAsync(hardDeleteTaskSql, new { CaseFileId = caseFileId }, trx);
                    result = await connection.ExecuteAsync(hardDeleteCaseFileWorkflowSql, new { CaseFileId = caseFileId }, trx);
                    result = await connection.ExecuteAsync(hardDeleteCaseFileSql, new { CaseFileId = caseFileId }, trx);
                    trx.Commit();
                }
            }

            return result == 1;
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
                    ,cf.Url
	                ,co.Id SupplierContactId
	                ,co.Name AS SupplierName
	                ,co.LastName AS SupplierLastName
                    ,cf.CreatedDate
                    ,COUNT(*) OVER () TotalCount
                FROM CaseFile cf 
                JOIN Contact co ON co.Id = cf.SupplierContactId
                WHERE @SearchText = '*'
                    OR cf.Name LIKE '%' + @SearchText + '%'
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

        public async Task<CaseFileModel> GetByIdAsync(int caseFileId)
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
                    ,cf.Url
	                ,co.Id SupplierContactId
	                ,co.Name AS SupplierName
	                ,co.LastName AS SupplierLastName
                    ,cf.CreatedDate
                FROM CaseFile cf 
                JOIN Contact co ON co.Id = cf.SupplierContactId                
                WHERE cf.Id = @CaseFileId";                

                var result = await connection.QueryAsync<CaseFileModel>(sqlQuery, new
                {
                    CaseFileId = caseFileId
                });

                var createdCaseFile = result.FirstOrDefault();
                createdCaseFile.Documents = new List<DocumentModel>();
                createdCaseFile.Workflows = new List<CaseFileWorkflowModel>();
                createdCaseFile.Tasks = new List<TaskModel>();

                return result.FirstOrDefault();
            }
        }

        public async Task<CaseFileModel> UpdateAsync(CaseFileModel caseFile, int currentUserId)
        {
            int caseFileWorkflowId = 0;

            using (var connection = await connectionProvider.OpenAsync())
            {
                string updateCaseFileDataSql = @"            
                UPDATE CaseFile
                SET CaseNumber = @CaseNumber
                    ,Name = @Name
                    ,Description = @Description
                    ,Url = @Url
                    ,SupplierContactId = @SupplierContactId
                    ,IsActive = @IsActive
                    ,IsDeleted = @IsDeleted
                    ,LastModifiedDate = GETUTCDATE()
                    ,UpdatedByUserId = @UpdatedByUserId
                WHERE Id = @Id
                ";

                string updateCaseFileWorkflowDataSql = @"            
                UPDATE CaseFileWorkflow                
                SET StartDate = @StartDate
                    ,EndDate = @EndDate
                    ,ExternalIdentifier = @ExternalIdentifier                    
                    ,LastModifiedDate = GETUTCDATE()
                    ,UpdatedByUserId = @UpdatedByUserId
                WHERE Id = @Id
                ";

                using (var trx = connection.BeginTransaction())
                {
                    // Update casefile data
                    await connection.ExecuteAsync(updateCaseFileDataSql, new
                    {
                        caseFile.Id,
                        caseFile.CaseNumber,
                        caseFile.Name,
                        caseFile.Description,
                        caseFile.Url,
                        caseFile.SupplierContactId,
                        caseFile.IsActive,
                        caseFile.IsDeleted,                        
                        UpdatedByUserId = currentUserId
                    }, trx);

                    // Insert casefileworkflow data
                    foreach (CaseFileWorkflowModel wf in caseFile.Workflows)
                    {
                        caseFileWorkflowId = await connection.ExecuteAsync(updateCaseFileWorkflowDataSql, new
                        {
                            wf.Id,
                            wf.StartDate,
                            wf.EndDate,
                            wf.ExternalIdentifier,
                            UpdatedByUserId = currentUserId
                        }, trx);
                    }

                    trx.Commit();
                }
            }

            return await GetByIdAsync(caseFile.Id);

        }

        public async Task<bool> UpdateWorkflowAsync(CaseFileWorkflowModel workflow, int currentUserId)
        {
            int caseFileWorkflowHistoryId = 0;
            
            using (var connection = await connectionProvider.OpenAsync())
            {
                string insertCaseFileWorkflowHistoryDataSql = @"            
                INSERT INTO CaseFileWorkflowHistory
                (
                    CaseFileWorkflowId                    
                    ,WorkflowStatusId
                    ,StartDate
                    ,EndDate
                    ,Notes                    
                    ,CreatedDate
                    ,CreatedByUserId
                    ,LastModifiedDate
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                SELECT 
	                Id AS CaseFileWorkflowId
	                ,WorkFlowStatusId
	                ,StartDate
	                ,GETDATE()
	                ,Notes
	                ,GETUTCDATE()
	                ,@CurrentUserId
	                ,GETUTCDATE()
	                ,@CurrentUserId
                FROM CaseFileWorkflow
                WHERE Id = @CaseFileWorkflowId";

                string updateCaseFileWorkflowDataSql = @"            
                UPDATE CaseFileWorkflow 
                SET 
	                WorkFlowStatusId = @WorkflowStatusId
                    ,Notes = @Notes
	                ,EndDate = GETDATE()
	                ,UpdatedByUserId = @CurrentUserId
                WHERE Id = @CaseFileWorkflowId ";

                using (var trx = connection.BeginTransaction())
                {
                    // Insert CaseFile workflow history data
                    caseFileWorkflowHistoryId = connection.QuerySingle<int>(insertCaseFileWorkflowHistoryDataSql, new
                    {
                        CaseFileWorkflowId = workflow.Id,
                        CurrentUserId = currentUserId
                    }, trx);

                    // Insert CaseFile workflow history data
                    await connection.ExecuteAsync(updateCaseFileWorkflowDataSql, new
                    {
                        CaseFileWorkflowId = workflow.Id,
                        WorkflowStatusId = workflow.WorkflowStatusId,
                        Notes = workflow.Notes,
                        CurrentUserId = currentUserId
                        
                    }, trx);

                    trx.Commit();
                }
            }

            return true;
        }
    }
}