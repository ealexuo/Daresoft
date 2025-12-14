using Daresoft.Core.Models;
using Daresoft.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Qfile.Core.Modelos;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationSettingsModel _appSetings;
        private readonly IUsersService _usersService;

        public UsersController(IOptions<ApplicationSettingsModel> appSettings, IUsersService userService)
        {
            _appSetings = appSettings.Value;
            _usersService = userService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int offset, [FromQuery] int fetch, [FromQuery] string searchText)
        {
            try
            {
                var usersList = await _usersService.GetAllAsync(offset, fetch, searchText);

                return Ok(new
                {
                    usersList = usersList,
                    totalCount = usersList.Count > 0 ? usersList[0].TotalCount : 0
                });
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserProfileModel user)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var updatedUser = await _usersService.UpdateAsync(user, currentUserId);

                return Ok();
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserProfileModel user)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var updatedUser = await _usersService.CreateAsync(user, currentUserId);

                return Ok();
            }
            catch(InvalidOperationException ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(409, ex.Message);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var result = await _usersService.DeleteAsync(userId, currentUserId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }
    }
}
