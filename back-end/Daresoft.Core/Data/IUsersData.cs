using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Daresoft.Core.Models;

namespace Daresoft.Core.Data
{
    public interface IUsersData
    {
        Task<UserProfileModel> GetByUserNameAsync(string userName);        
        Task<UserProfileModel> GetByIdAsync(int userId);
        Task<List<UserProfileModel>> GetAllAsync(int offset, int fetch, string searchString);
        Task<UserProfileModel> CreateAsync(UserProfileModel user, int currentUserId);
        Task<UserProfileModel> UpdateAsync(UserProfileModel user, int currentUserId);
        Task<bool> DeleteAsync(int userId, int currentUserId);
    }
}
