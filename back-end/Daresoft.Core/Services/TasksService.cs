using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class TasksService : ITasksService
    {
        private readonly ITasksData _tasksData;

        public TasksService(ITasksData tasksData)
        {
            _tasksData = tasksData;            
        }

        public async Task<TaskModel> CreateAsync(TaskModel task, int currentUserId)
        {
            return await _tasksData.CreateAsync(task, currentUserId);
        }

        public async Task<bool> DeleteAsync(int taskId, int currentUserId)
        {
            return await _tasksData.DeleteAsync(taskId, currentUserId);
        }

        public Task<List<TaskModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            throw new NotImplementedException();
        }

        public async Task<List<TaskModel>> GetByCaseFileIdsAsync(List<int> caseFileIds)
        {
            return await _tasksData.GetByCaseFileIdsAsync(caseFileIds);
        }

        public Task<TaskModel> GetByIdAsync(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task<TaskModel> UpdateAsync(TaskModel task, int currentUserId)
        {
            return await _tasksData.UpdateAsync(task, currentUserId);
        }
    }
}
