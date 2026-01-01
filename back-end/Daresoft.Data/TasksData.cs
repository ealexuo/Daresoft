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
using System.Xml.Linq;
//using Org.BouncyCastle.Asn1.X509;

namespace Daresoft.Data
{
    public class TasksData : ITasksData
    {
        private readonly IConnectionProvider connectionProvider;

        public TasksData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public async Task<TaskModel> CreateAsync(TaskModel task, int currentUserId)
        {
            int taskId = 0;
            
            using (var connection = await connectionProvider.OpenAsync())
            {
                string insertTaskDataSql = @"            
                INSERT INTO Task
                (
                    CaseFileId
                    ,WorkflowId
                    ,Name
                    ,Description
                    ,AssignedToUserId
                    ,Priority
                    ,DueDate
                    ,Reviewer
                    ,IsCompleted
                    ,CompletedDate                    
                    ,CreatedDate
                    ,LastModifiedDate
                    ,CreatedByUserId
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @CaseFileId
                    ,@WorkflowId
                    ,@Name
                    ,@Description
                    ,@AssignedToUserId
                    ,@Priority
                    ,@DueDate
                    ,@Reviewer
                    ,@IsCompleted
                    ,@CompletedDate                    
                    ,GETUTCDATE()
                    ,GETUTCDATE()
                    ,@CreatedByUserId
                    ,@UpdatedByUserId
                )";

                using (var trx = connection.BeginTransaction())
                {
                    // Insert casefile data
                    taskId = connection.QuerySingle<int>(insertTaskDataSql, new
                    {
                        task.CaseFileId,
                        task.WorkflowId,
                        task.Name,
                        task.Description,
                        task.AssignedToUserId,
                        task.Priority,
                        task.DueDate,
                        task.Reviewer,
                        task.IsCompleted,
                        task.CompletedDate,
                        CreatedByUserId = currentUserId,
                        UpdatedByUserId = currentUserId
                    }, trx);                    

                    trx.Commit();
                }
            }

            return await GetByIdAsync(taskId);
        }

        public Task<bool> DeleteAsync(int task, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<TaskModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    Id
	                ,CaseFileId
	                ,Name
	                ,Description
	                ,AssignedToUserId 
	                ,Priority
	                ,DueDate
	                ,IsCompleted
	                ,CompletedDate
                    ,COUNT(*) OVER () TotalCount
                FROM Task                
                WHERE @SearchText = '*'
                    OR Name LIKE '%' + @SearchText + '%'
                    OR Description LIKE '%' + @SearchText + '%'
                ORDER BY UPPER(cf.Name) 
                OFFSET (@Offset-1)*@Fetch ROWS
                FETCH NEXT @Fetch ROWS ONLY";

                if (String.IsNullOrEmpty(searchText))
                    searchText = "*";

                var result = await connection.QueryAsync<TaskModel>(sqlQuery, new
                {
                    Offset = offset,
                    Fetch = fetch,
                    SearchText = searchText
                });

                return result.ToList();
            }
        }

        public async Task<List<TaskModel>> GetByCaseFileIdsAsync(List<int> caseFileIds)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    ta.Id
	                ,ta.CaseFileId
                    ,ta.WorkflowId
                    ,wf.Name AS WorkflowName
                    ,wf.Code AS WorkflowCode
                    ,wf.Color AS WorkflowColor
	                ,ta.Name
	                ,ta.Description
	                ,ta.AssignedToUserId 
	                ,ta.Priority
	                ,ta.DueDate
                    ,ta.Reviewer
	                ,ta.IsCompleted
	                ,ta.CompletedDate
                    ,COUNT(*) OVER () TotalCount
                FROM Task ta
                LEFT JOIN Workflow wf on ta.WorkflowId = wf.Id
                WHERE CaseFileId IN @CaseFileIds
                ORDER BY ta.Id";
                
                var result = await connection.QueryAsync<TaskModel>(sqlQuery, new
                {
                    CaseFileIds = caseFileIds
                });

                return result.ToList();
            }
        }

        public async Task<TaskModel> GetByIdAsync(int taskId)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    Id
	                ,CaseFileId
                    ,WorkflowId
	                ,Name
	                ,Description
	                ,AssignedToUserId 
	                ,Priority
	                ,DueDate
	                ,IsCompleted
	                ,CompletedDate
                FROM Task                
                WHERE Id = @TaskId";

                var result = await connection.QueryAsync<TaskModel>(sqlQuery, new
                {
                    TaskId = taskId
                });

                return result.FirstOrDefault();
            }
        }

        public Task<TaskModel> UpdateAsync(TaskModel task, int currentUserId)
        {
            throw new NotImplementedException();
        }
    }
}