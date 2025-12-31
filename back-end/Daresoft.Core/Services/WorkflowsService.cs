using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class WorkflowsService : IWorkflowsService
    {
        private readonly IWorkflowsData _workflowsData;

        public WorkflowsService(IWorkflowsData workflowsData)
        {
            _workflowsData = workflowsData;            
        }

        public Task<WorkflowModel> CreateAsync(WorkflowModel workflow, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int workflowId, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<WorkflowModel>> GetAllAsync()
        {
            return await _workflowsData.GetAllAsync();
        }

        public async Task<List<CaseFileWorkflowModel>> GetByCaseFileIdsAsync(List<int> caseFileIds)
        {
            return await _workflowsData.GetByCaseFileIdsAsync(caseFileIds);
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
