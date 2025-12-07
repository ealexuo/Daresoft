using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Daresoft.Core.Models;

namespace Daresoft.Core.Data
{
    public interface IUserData
    {
        Task<UserModel> GetByUserNameAsync(string userName);        
        Task<UserModel> GetByIdAsync(int userId);
        Task<List<UserModel>> GetAllAsync(int offset, int fetch, string searchString);
        Task<int> CreateAsync(UserModel user, string password, DateTime createdDate, int createdByUserId);
        Task<int> EditAsync(UserModel user, DateTime createdDate);
        Task<bool> DeleteAsync(int idEntidad, int idUsuario);
    }
}
