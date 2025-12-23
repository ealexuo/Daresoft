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
    public class TasksData : ITasksData
    {
        private readonly IConnectionProvider connectionProvider;

        public TasksData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public Task<TaskModel> CreateAsync(TaskModel task, int currentUserId)
        {
            throw new NotImplementedException();
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
                WHERE CaseFileId IN @CaseFileIds";
                
                var result = await connection.QueryAsync<TaskModel>(sqlQuery, new
                {
                    CaseFileIds = caseFileIds
                });

                return result.ToList();
            }
        }

        public Task<TaskModel> GetByIdAsync(int taskId)
        {
            throw new NotImplementedException();
        }

        public Task<TaskModel> UpdateAsync(TaskModel task, int currentUserId)
        {
            throw new NotImplementedException();
        }
    }
}