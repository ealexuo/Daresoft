using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Daresoft.Core.Models;

namespace Daresoft.Core.Data
{
    public interface ITasksData
    {
        Task<TaskModel> GetByIdAsync(int taskId);
        Task<TaskModel> CreateAsync(TaskModel task, int currentUserId);
        Task<TaskModel> UpdateAsync(TaskModel task, int currentUserId);
        Task<List<TaskModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<List<TaskModel>> GetByCaseFileIdsAsync(List<int> caseFileIds);
        Task<bool> DeleteAsync(int task, int currentUserId);
    }
}
