using Daresoft.Core.Models;
using Daresoft.Core.Types;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public interface IAuthenticationService
    {        
        Task<int> ValidatePasswordAsync(SignInModel userAuth, string signInPassword);
        Task<int> ChangePasswordAsync(int userId, string newPassword);
        Task<int> SignInRegistration(int idUsuario, string userName);
        Task<SignInModel> GetByUserName(string userName);
    }
}
