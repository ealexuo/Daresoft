using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserData _userData;
        private readonly IEncryptPasswordService _encryptPasswordService;
        //private readonly ICorreoElectronicoServicio _correoElectronicoServicio;
        //private readonly IInhabilitacionServicio _inhabilitacionServicio;

        public UserService(
            IUserData userData,
            IEncryptPasswordService encryptPasswordService
            //ICorreoElectronicoServicio correoElectronicoServicio,
            //IInhabilitacionServicio inhabilitacionServicio
            )
        {
            _userData = userData;
            _encryptPasswordService = encryptPasswordService;
            //_correoElectronicoServicio = correoElectronicoServicio;
            //_inhabilitacionServicio = inhabilitacionServicio;
        }

        public async Task<UserModel> GetByUserNameAsync(string userName)
        {
            //string correoElectronico = "";
            //string identificacionPersonal = "";

            //Regex regexCorreo = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            //Match match = regexCorreo.Match(nombreUsuario);

            //if (match.Success)
            //    correoElectronico = nombreUsuario;
            //else
            //    identificacionPersonal = nombreUsuario;

            return await _userData.GetByUserNameAsync(userName);
        }

        public async Task<UserModel> GetByIdAsync(int userId)
        {
            return await _userData.GetByIdAsync(userId);
        }

        public async Task<int> CreateAsync(UserModel usuario, int createdByUserId)
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

        public async Task<int> UpdateAsync(UserModel usuario)
        {
            // return await _datos.EditarUsuarioAsync(usuario, UtilidadesServicio.FechaActualUtc);
            return 1;
        }

        public async Task<List<UserModel>> GetAllAsync(int offset, int fetch, string searchString)
        {
            //var listaUsuarios = await _datos.ObtenerUsuariosAsync(pagina, cantidad, buscarTexto);

            //foreach(var usuario in listaUsuarios)
            //{
            //    usuario.FechasInhabilitacion = await _inhabilitacionServicio.ObtenerFechasInhabilitacionUsuarioAsync(usuario.IdUsuario);
            //}

            //return listaUsuarios;

            return null;
        }

        public async Task<bool> DeleteAsync(int userId)
        {
            //return await _datos.EliminarUsuarioAsync(idEntidad, idUsuario);
            return false;
        }

        public async Task<UserModel> ObtenerUsuarioAsync(int userid)
        {
            //return await _datos.ObtenerUsuarioAsync(idUsuario);
            return null;
        }
    }
}
