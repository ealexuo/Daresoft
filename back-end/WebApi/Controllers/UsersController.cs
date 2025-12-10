using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Daresoft.Core.Services;
using System;
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
    }
}
