using Daresoft.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationSettingsModel _appSetings;
        private readonly IContactsService _contactsService;

        public ContactsController(IOptions<ApplicationSettingsModel> appSettings, IContactsService contactsService)
        {
            _appSetings = appSettings.Value;
            _contactsService = contactsService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int offset, [FromQuery] int fetch, [FromQuery] string searchText)
        {
            //try
            //{
            //    var usersList = await _usersService.GetAllAsync(offset, fetch, searchText);

            //    return Ok(new
            //    {
            //        usersList = usersList,
            //        totalCount = usersList.Count > 0 ? usersList[0].TotalCount : 0
            //    });
            //}
            //catch (Exception ex)
            //{
            //    //ex.ToExceptionless().Submit();
            //    return StatusCode(500, ex.Message);
            //}
            return StatusCode(404);
        }

        [Authorize]
        [HttpGet("{contactId}")]
        public async Task<IActionResult> GetById(int contactId)
        {
            try
            {
                var contact = await _contactsService.GetByIdAsync(contactId);
                return Ok(contact);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }
    }
}
