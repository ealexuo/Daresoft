using Daresoft.Core.Models;
using Daresoft.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using WebApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseFilesController : ControllerBase
    {
        private readonly ApplicationSettingsModel _appSetings;
        private readonly ICaseFilesService _caseFilesService;
        private readonly ITasksService _tasksService;

        public CaseFilesController(
            IOptions<ApplicationSettingsModel> appSettings, 
            ICaseFilesService caseFilesService,
            ITasksService tasksService
        )
        {
            _appSetings = appSettings.Value;
            _caseFilesService = caseFilesService;
            _tasksService = tasksService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int offset, [FromQuery] int fetch, [FromQuery] string searchText)
        {
            try
            {
                List<CaseFileModel> caseFilesList = await _caseFilesService.GetAllAsync(offset, fetch, searchText);
                List<int> caseFileIds = caseFilesList.Select(cf => cf.Id).ToList();
                List<TaskModel> tasksList = await _tasksService.GetByCaseFileIdsAsync(caseFileIds);

                foreach (var caseFile in caseFilesList)
                {
                    caseFile.Tasks = tasksList.Where(t => t.CaseFileId == caseFile.Id && t.WorkflowId == caseFile.WorkflowId).ToList();
                }

                return Ok(new
                {
                    caseFilesList = caseFilesList,
                    totalCount = caseFilesList.Count > 0 ? caseFilesList[0].TotalCount : 0
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
                var contact = await _caseFilesService.GetByIdAsync(contactId);
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
                //var identity = HttpContext.User.Identity as ClaimsIdentity;
                //int currentUserId = 0;

                //if (identity != null)
                //{
                //    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                //}

                //var updatedUser = await _caseFilesService.UpdateAsync(contact, currentUserId);

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
                //var identity = HttpContext.User.Identity as ClaimsIdentity;
                //int currentUserId = 0;

                //if (identity != null)
                //{
                //    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                //}

                //var updatedUser = await _caseFilesService.CreateAsync(contact, currentUserId);

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
                //var identity = HttpContext.User.Identity as ClaimsIdentity;
                //int currentUserId = 0;

                //if (identity != null)
                //{
                //    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                //}

                //var result = await _caseFilesService.DeleteAsync(contactId, currentUserId);

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
