using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Daresoft.Core.Models;

namespace Daresoft.Core.Data
{
    public interface IWorkflowsData
    {
        Task<WorkflowModel> GetByIdAsync(int workflowId);
        Task<WorkflowModel> CreateAsync(WorkflowModel workflow, int currentUserId);
        Task<WorkflowModel> UpdateAsync(WorkflowModel workflow, int currentUserId);
        Task<List<WorkflowModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<List<CaseFileWorkflowModel>> GetByCaseFileIdsAsync(List<int> caseFileIds);
        Task<bool> DeleteAsync(int workflow, int currentUserId);
    }
}
