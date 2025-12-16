using Daresoft.Core.Models;
using Daresoft.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Security.Claims;
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
            try
            {
                var contactsList = await _contactsService.GetAllAsync(offset, fetch, searchText);

                return Ok(new
                {
                    contactsList = contactsList,
                    totalCount = contactsList.Count > 0 ? contactsList[0].TotalCount : 0
                });
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
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

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ContactModel contact)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var updatedUser = await _contactsService.UpdateAsync(contact, currentUserId);

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
        public async Task<IActionResult> Create([FromBody] ContactModel contact)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var updatedUser = await _contactsService.CreateAsync(contact, currentUserId);

                return Ok();
            }
            catch (InvalidOperationException ex)
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
        [HttpDelete("{contactId}")]
        public async Task<IActionResult> Delete(int contactId)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var result = await _contactsService.DeleteAsync(contactId, currentUserId);

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
