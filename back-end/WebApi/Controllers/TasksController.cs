using Daresoft.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using Daresoft.Core.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITasksService _tasksService;
        private readonly IDocumentsService _documentsService;
        private readonly IWorkflowsService _workflowsService;

        public TasksController(ITasksService tasksService, IDocumentsService documentsService, IWorkflowsService workflowsService)
        {
            _tasksService = tasksService;
            _documentsService = documentsService;
            _workflowsService = workflowsService;
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
        public async Task<IActionResult> Update([FromBody] TaskModel task)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var updatedTask = await _tasksService.UpdateAsync(task, currentUserId);
                var currentDocuments = await _documentsService.GetByCaseFileIdsAsync([task.CaseFileId]);

                if(task.Documents.Count > 0)
                {
                    // Check completion documents
                    if (task.Documents[0].Path.Contains("/tasks/" + task.Id + "/completion-document/"))
                    {
                        if (currentDocuments.Exists((d) => d.Path.Contains("/tasks/" + task.Id + "/completion-document/")))
                        {
                            task.Documents[0] = await _documentsService.UpdateAsync(task.Documents[0], currentUserId);
                        }
                        else
                        {
                            task.Documents[0] = await _documentsService.CreateAsync(task.Documents[0], currentUserId);
                        }
                    }

                    // Check for task root document
                    if (task.Documents[0].Path.IsNullOrEmpty())
                    {
                        task.Documents[0].Path = "/case-files/" + task.CaseFileId + "/workflows/" + task.WorkflowId + "/tasks/" + updatedTask.Id + "/" + task.Documents[0].Name;

                        if (currentDocuments.Exists((d) => d.Path.Contains("/tasks/" + task.Id + "/"))){
                            task.Documents[0] = await _documentsService.UpdateAsync(task.Documents[0], currentUserId);
                        }
                        else
                        {
                            task.Documents[0] = await _documentsService.CreateAsync(task.Documents[0], currentUserId);
                        }
                    }

                    if (task.Documents.Count > 0)
                    {
                        updatedTask.Documents.Add(task.Documents[0]);
                    }
                }

                return Ok(updatedTask);
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
                    task.Documents[i].Path = "/case-files/" + task.CaseFileId + "/workflows/" + task.WorkflowId + "/tasks/" + createdTask.Id + "/" + task.Documents[i].Name;
                    task.Documents[i] = await _documentsService.CreateAsync(task.Documents[i], currentUserId);

                    createdTask.Documents.Add(task.Documents[i]);
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
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> Delete(int taskId)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var result = await _tasksService.DeleteAsync(taskId, currentUserId);

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
