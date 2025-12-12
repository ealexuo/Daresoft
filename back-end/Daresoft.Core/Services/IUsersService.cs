using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IUsersService
    {
        Task<UserProfileModel> GetByUserNameAsync(string userName);
        Task<UserProfileModel> GetByIdAsync(int userId);
        Task<int> CreateAsync(UserProfileModel user, int currentUserId);
        Task<UserProfileModel> UpdateAsync(UserProfileModel user, int currentUserId);
        Task<List<UserProfileModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<bool> DeleteAsync(int userId);  
    }
}
