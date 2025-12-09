using Daresoft.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IUserService
    {
        Task<UserProfileModel> GetByUserNameAsync(string userName);
        Task<UserProfileModel> GetByIdAsync(int userId);
        Task<int> CreateAsync(UserProfileModel user, int currentUserId);
        Task<int> UpdateAsync(UserProfileModel user);
        Task<List<UserProfileModel>> GetAllAsync(int offset, int fetch, string searchText);
        Task<bool> DeleteAsync(int userId);        
    }
}
