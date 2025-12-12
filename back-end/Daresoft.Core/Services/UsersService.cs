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

        public async Task<int> CreateAsync(UserProfileModel usuario, int createdByUserId)
        {
            //var usuarioExistente = await _datos.ObtenerPorNombreUsuarioAsync(usuario.NoIdentificacionPersonal, usuario.CorreoElectronico);

            //if (usuarioExistente == null)
            //{
            //    string passwordTemporal = UtilidadesServicio.GenerarCadenaAleatoria();
            //    int resultado = await _datos.CrearUsuarioAsync(usuario, _encryptServicio.HashPassword(passwordTemporal), UtilidadesServicio.FechaActualUtc, idUsuarioRegistro);

            //    if (resultado != 0)
            //    {
            //        await _correoElectronicoServicio.Enviar(
            //            usuario.CorreoElectronico,
            //            "QFile - Su Password Temporal",
            //            "<p>Su nombre de usuario es: " + usuario.NoIdentificacionPersonal + ". Su contraseña temporal es: " + passwordTemporal + "</p> <a href=\"" + UtilidadesServicio.UrlQfile + "\">Click Aqui</a>"
            //        );
            //    }

            //    return resultado;
            //}
            //else 
            //    return -1;

            return 1;
        }

        public async Task<UserProfileModel> UpdateAsync(UserProfileModel user, int currentUserId)
        {
            return await _usersData.UpdateAsync(user, currentUserId);
        }

        public async Task<List<UserProfileModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            return await _usersData.GetAllAsync(offset, fetch, searchText);            
        }

        public async Task<bool> DeleteAsync(int userId)
        {
            //return await _datos.EliminarUsuarioAsync(idEntidad, idUsuario);
            return false;
        }

        public async Task<UserProfileModel> ObtenerUsuarioAsync(int userid)
        {
            //return await _datos.ObtenerUsuarioAsync(idUsuario);
            return null;
        }
    }
}
