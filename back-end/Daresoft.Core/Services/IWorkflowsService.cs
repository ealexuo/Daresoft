using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IWorkflowsService
    {
        Task<WorkflowModel> GetByIdAsync(int workflowId);
        Task<WorkflowModel> CreateAsync(WorkflowModel workflow, int currentUserId);
        Task<WorkflowModel> UpdateAsync(WorkflowModel workflow, int currentUserId);
        Task<List<WorkflowModel>> GetAllAsync();
        Task<List<CaseFileWorkflowModel>> GetByCaseFileIdsAsync(List<int> caseFileIds);
        Task<bool> DeleteAsync(int workflowId, int currentUserId);
    }
}
