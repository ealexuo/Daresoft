using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface ITasksService
    {
        Task<TaskModel> GetByIdAsync(int taskId);
        Task<TaskModel> CreateAsync(TaskModel task, int currentUserId);
        Task<TaskModel> UpdateAsync(TaskModel task, int currentUserId);
        Task<List<TaskModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<List<TaskModel>> GetByCaseFileIdsAsync(List<int> caseFileIds);
        Task<bool> DeleteAsync(int taskId, int currentUserId);
    }
}
