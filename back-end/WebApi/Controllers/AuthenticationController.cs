using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Daresoft.Core.Types;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;
using Exceptionless;
using Daresoft.Core.Services;
using Daresoft.Core.Models;
using WebApi.Models;


namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ApplicationSettingsModel _appSetings;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUsersService _userService;

        public AuthenticationController(IOptions<ApplicationSettingsModel> appSettings, IAuthenticationService authenticationService, IUsersService userService)
        {
            _appSetings = appSettings.Value;
            _authenticationService = authenticationService;
            _userService = userService;
        }

        // GET: api/authentication/signin
        [HttpPost("signin")]
        public async Task<IActionResult> Signin(SignInModel signin)
        {
            try
            {
                int checkPasswordResult = PasswordValidationTypes.Invalid;
                var userAuth = await _authenticationService.GetByUserName(signin.UserName);

                if (userAuth != null)
                {
                    checkPasswordResult = await _authenticationService.ValidatePasswordAsync(userAuth, signin.Password);
                }

                if (userAuth == null || checkPasswordResult == PasswordValidationTypes.Invalid)
                    return StatusCode(400);

                if (checkPasswordResult == PasswordValidationTypes.Valid)
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[] { 
                            new Claim("UserId", userAuth.UserId.ToString(), null),
                            new Claim("IdUsuario", userAuth.UserName.ToString(), null)                    
                        }),
                        Expires = DateTime.UtcNow.AddDays(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSetings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature),
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var token = tokenHandler.WriteToken(securityToken);

                    await _authenticationService.SignInRegistration(userAuth.UserId, userAuth.UserName);

                    return Ok(new { token });
                }
                else if (checkPasswordResult == PasswordValidationTypes.ValidRequiereChange)
                {
                    return Ok(new { token = "RequierePasswordChange" });
                }
                else
                {
                    return BadRequest(new { message = "Incorrect User or Password" });
                }
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        // Post: api/authentication/password
        //[Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordModel modelo)
        {
            try
            {
                //UsuarioModelo usuario = await _usuarioServicio.ObtenerPorNombreUsuarioAsync(modelo.NombreUsuario);
                //var resultadoCheckPassword = await _servicio.ValidaPasswordAsync(usuario.IdUsuario, modelo.PasswordActual);

                //if (resultadoCheckPassword == ValidaPasswordTipos.ValidoRequiereCambio)
                //{
                //    await _servicio.CambiarPasswordAsync(usuario.IdUsuario, modelo.PasswordNuevo);

                //    var tokenDescriptor = new SecurityTokenDescriptor
                //    {
                //        Subject = new ClaimsIdentity(new Claim[] {
                //    new Claim("IdUsuario", usuario.IdUsuario.ToString(), null),
                //    new Claim("IdEntidad", usuario.IdEntidad.ToString(), null)
                //}),
                //        Expires = DateTime.UtcNow.AddDays(1),
                //        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSetings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature),
                //    };
                //    var tokenHandler = new JwtSecurityTokenHandler();
                //    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                //    var token = tokenHandler.WriteToken(securityToken);

                //    await _servicio.RegistrarLogeo(usuario.IdEntidad, usuario.IdUsuario);

                //    return Ok(new { token });
                //}
                //else
                //{
                //    return BadRequest(new { message = "Usuario o password incorrecto." });
                //}

                return Ok();
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }
    }   
}

