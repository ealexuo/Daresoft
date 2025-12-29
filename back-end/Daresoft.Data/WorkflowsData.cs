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
    public class WorkflowsData : IWorkflowsData
    {
        private readonly IConnectionProvider connectionProvider;

        public WorkflowsData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public Task<WorkflowModel> CreateAsync(WorkflowModel workflow, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int workflow, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<List<WorkflowModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            throw new NotImplementedException();
        }

        public async Task<List<CaseFileWorkflowModel>> GetByCaseFileIdsAsync(List<int> caseFileIds)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
                    cfw.Id
                    , cfw.CaseFileId
                    , cfw.WorkflowId
                    , wf.Name AS WorkflowName
                    , cfw.WorkflowStatusId
                    , wfs.Name AS WorkflowStatusName
                    , cfw.StartDate
                    , cfw.EndDate
                    , cfw.ExternalIdentifier
                    , cfw.StartDate
                    , cfw.EndDate                
                FROM CaseFileWorkflow cfw
                JOIN Workflow wf ON cfw.WorkflowId = wf.Id
                JOIN WorkflowStatus wfs ON cfw.WorkflowStatusId = wfs.Id
                WHERE CaseFileId IN @CaseFileIds";

                var result = await connection.QueryAsync<CaseFileWorkflowModel>(sqlQuery, new
                {
                    CaseFileIds = caseFileIds
                });

                return result.ToList();
            }       
        }

        public Task<WorkflowModel> GetByIdAsync(int workflowId)
        {
            throw new NotImplementedException();
        }

        public Task<WorkflowModel> UpdateAsync(WorkflowModel workflow, int currentUserId)
        {
            throw new NotImplementedException();
        }
    }
}