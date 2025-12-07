using Daresoft.Core.Models;
using System;
using System.Threading.Tasks;

namespace Daresoft.Core.Data
{
    public interface IAuthenticationData
    {
        Task<SignInModel> GetPasswordHashAsync(int userId);
        Task<int> SavePasswordAsync(SignInModel signInModel);
        Task<int> ChangePasswordAsync(int userId, string password);
        Task<int> SignInRegistration(int userId, DateTime createdDate);
    }
}
