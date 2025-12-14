using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersData _usersData;
        private readonly IEncryptPasswordService _encryptPasswordService;
        //private readonly ICorreoElectronicoServicio _correoElectronicoServicio;
        //private readonly IInhabilitacionServicio _inhabilitacionServicio;

        public UsersService(
            IUsersData usersData,
            IEncryptPasswordService encryptPasswordService
            //ICorreoElectronicoServicio correoElectronicoServicio,
            //IInhabilitacionServicio inhabilitacionServicio
            )
        {
            _usersData = usersData;
            _encryptPasswordService = encryptPasswordService;
            //_correoElectronicoServicio = correoElectronicoServicio;
            //_inhabilitacionServicio = inhabilitacionServicio;
        }

        public async Task<UserProfileModel> GetByUserNameAsync(string userName)
        {
            return await _usersData.GetByUserNameAsync(userName);
        }

        public async Task<UserProfileModel> GetByIdAsync(int userId)
        {
            return await _usersData.GetByIdAsync(userId);
        }

        public async Task<UserProfileModel> CreateAsync(UserProfileModel user, int currentUserId)
        {            
            var existingUser = await _usersData.GetByUserNameAsync(user.UserName);

            if (existingUser != null)
            {
                throw new InvalidOperationException("Exists");
            }

            user.Password = _encryptPasswordService.HashPassword(user.Password);
            return await _usersData.CreateAsync(user, currentUserId);            
        }

        public async Task<UserProfileModel> UpdateAsync(UserProfileModel user, int currentUserId)
        {
            return await _usersData.UpdateAsync(user, currentUserId);
        }

        public async Task<List<UserProfileModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            return await _usersData.GetAllAsync(offset, fetch, searchText);            
        }

        public async Task<bool> DeleteAsync(int userId, int currentUserId)
        {
            return await _usersData.DeleteAsync(userId, currentUserId);
        }

        public async Task<UserProfileModel> ObtenerUsuarioAsync(int userid)
        {
            //return await _datos.ObtenerUsuarioAsync(idUsuario);
            return null;
        }
    }
}
