using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Daresoft.Core.Data;
using Daresoft.Core.Types;

namespace Daresoft.Core.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IAuthenticationData _authenticationData;
        private readonly IUserData _userData;
        private readonly IEncryptPasswordService _encryptPasswordService;        

        public AuthenticationService(IAuthenticationData authenticationData, IUserData userData, IEncryptPasswordService encryptPasswordService)
        {
            _authenticationData = authenticationData;
            _userData = userData;
            _encryptPasswordService = encryptPasswordService;
        }

        public async Task<int> ValidatePasswordAsync(int userId, string password)
        {
            //var password = await _authenticationData.GetPasswordAsync(userId);

            //if (datosPassword == null)
            //    return PasswordValidationType.Invalid;

            //var esPasswordValido = _encryptPasswordService.VerifyHashedPassword(datosPassword.Password, password);

            //if (esPasswordValido && (datosPassword.RequiereCambioPassword))
            //{
            //    return ValidaPasswordTipos.ValidoRequiereCambio;
            //}
            //else if (esPasswordValido)
            //{
            //    return ValidaPasswordTipos.Valido;
            //}
            //else
            //{
            //    return ValidaPasswordTipos.Invalido;
            //}
            return 1;
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

        public async Task<int> SignInRegistration(int userId)
        {
            //DateTime fechaRegistro = UtilidadesServicio.FechaActualUtc;
            //return await _authenticationData.RegistrarLogeo(idEntidad, idUsuario, fechaRegistro);
            return 1;
        }
    }
}
