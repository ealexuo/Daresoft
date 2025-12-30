using Daresoft.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using Daresoft.Core.Models;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITasksService _tasksService;
        private readonly IDocumentsService _documentsService;

        public TasksController(ITasksService tasksService, IDocumentsService documentsService)
        {
            _tasksService = tasksService;
            _documentsService = documentsService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int offset, [FromQuery] int fetch, [FromQuery] string searchText)
        {
            try
            {
                //List<CaseFileModel> caseFilesList = await _caseFilesService.GetAllAsync(offset, fetch, searchText);
                //List<int> caseFileIds = caseFilesList.Select(cf => cf.Id).ToList();
                //List<TaskModel> tasksList = await _tasksService.GetByCaseFileIdsAsync(caseFileIds);
                //List<DocumentModel> documentsList = await _documentsService.GetByCaseFileIdsAsync(caseFileIds);
                //List<CaseFileWorkflowModel> workflowsList = await _workflowsService.GetByCaseFileIdsAsync(caseFileIds);

                //foreach (var caseFile in caseFilesList)
                //{
                //    caseFile.Tasks = tasksList.Where(t => t.CaseFileId == caseFile.Id).ToList();
                //    caseFile.Documents = documentsList.Where(d => d.CaseFileId == caseFile.Id).ToList();
                //    caseFile.Workflows = workflowsList.Where(w => w.CaseFileId == caseFile.Id).ToList();
                //}

                //return Ok(new
                //{
                //    caseFilesList = caseFilesList,
                //    totalCount = caseFilesList.Count > 0 ? caseFilesList[0].TotalCount : 0
                //});

                return Ok();
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpGet("{taskId}")]
        public async Task<IActionResult> GetById(int taskId)
        {
            try
            {
                //var contact = await _caseFilesService.GetByIdAsync(caseFileId);
                //return Ok(contact);

                return Ok();
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CaseFileModel caseFile)
        {
            try
            {
                //var identity = HttpContext.User.Identity as ClaimsIdentity;
                //int currentUserId = 0;

                //if (identity != null)
                //{
                //    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                //}

                //var updatedUser = await _caseFilesService.UpdateAsync(caseFile, currentUserId);

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
        public async Task<IActionResult> Create([FromBody] TaskModel task)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var createdTask = await _tasksService.CreateAsync(task, currentUserId);

                for (int i = 0; i < task.Documents.Count; i++)
                {
                    task.Documents[i].Path = "CF" + task.CaseFileId + "/" + task.Documents[i].Path + "/Tasks/" + createdTask.Id + "/" + task.Documents[i].Name;
                    task.Documents[i] = await _documentsService.CreateAsync(task.Documents[i], currentUserId);
                }

                return Ok(createdTask);
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
