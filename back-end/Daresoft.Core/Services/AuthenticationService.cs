using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Daresoft.Core.Types;

namespace Daresoft.Core.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUsersData _userData;
        private readonly IEncryptPasswordService _encryptPasswordService;        

        public AuthenticationService(IUsersData userData, IEncryptPasswordService encryptPasswordService)
        {
            _userData = userData;
            _encryptPasswordService = encryptPasswordService;
        }

        public async Task<int> ValidatePasswordAsync(UserProfileModel user, string signInPassword)
        {                           
            var isValidPassword = _encryptPasswordService.VerifyHashedPassword(user.PasswordHash, signInPassword);

            if (isValidPassword && (user.IsPasswordChangeRequired))
            {
                return PasswordValidationTypes.ValidRequiereChange;
            }
            else if (isValidPassword)
            {
                return PasswordValidationTypes.Valid;
            }
            else
            {
                return PasswordValidationTypes.Invalid;
            }
        }

        public async Task<int> ChangePasswordAsync(int idUsuario, string passwordNuevo)
        {
            //var password = _encryptPasswordService.HashPassword(passwordNuevo);
            //var resultado = await _authenticationData.CambiarPasswordAsync(idUsuario, password);

            ////TODO: Definir plantilla para correo
            //if (resultado != 0)
            //{
            //    var usuario = await _usuarioDatos.ObtenerPorIdAsync(idUsuario);
            //    await _correoElectronicoServicio.Enviar(
            //        usuario.CorreoElectronico,
            //        "QFile - Su Password ha sido modificado",
            //        "<p>Su password ha sido modificado exitosamente.</p> <a href=\"" + UtilidadesServicio.UrlQfile + "\">Click Aqui</a>"
            //    );
            //}

            //return resultado;
            return 1;
        }

        public async Task<int> SignInRegistration(int userId, string username)
        {
            //DateTime fechaRegistro = UtilidadesServicio.FechaActualUtc;
            //return await _authenticationData.RegistrarLogeo(idEntidad, idUsuario, fechaRegistro);
            return 1;
        }
    }
}
