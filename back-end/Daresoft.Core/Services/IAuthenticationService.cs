using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IAuthenticationService
    {
        Task<int> ValidatePasswordAsync(int userId, string password);
        Task<int> ChangePasswordAsync(int userId, string newPassword);
        Task<int> SignInRegistration(int idUsuario, string userName);
    }
}
