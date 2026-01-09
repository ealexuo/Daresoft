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
        private readonly IDocumentsService _documentsService;
        private readonly IWorkflowsService _workflowsService;

        public CaseFilesController(
            IOptions<ApplicationSettingsModel> appSettings, 
            ICaseFilesService caseFilesService,
            ITasksService tasksService,
            IDocumentsService documentsService,
            IWorkflowsService workflowsService
        )
        {
            _appSetings = appSettings.Value;
            _caseFilesService = caseFilesService;
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
                List<CaseFileModel> caseFilesList = await _caseFilesService.GetAllAsync(offset, fetch, searchText);
                List<int> caseFileIds = caseFilesList.Select(cf => cf.Id).ToList();
                List<TaskModel> tasksList = await _tasksService.GetByCaseFileIdsAsync(caseFileIds);
                List<DocumentModel> documentsList = await _documentsService.GetByCaseFileIdsAsync(caseFileIds);
                List<CaseFileWorkflowModel> workflowsList = await _workflowsService.GetByCaseFileIdsAsync(caseFileIds);

                foreach (var caseFile in caseFilesList)
                {
                    caseFile.Documents = documentsList.Where(d => d.CaseFileId == caseFile.Id).ToList();
                    caseFile.Workflows = workflowsList.Where(w => w.CaseFileId == caseFile.Id).ToList();
                    caseFile.Tasks = tasksList.Where(t => t.CaseFileId == caseFile.Id).ToList();
                    
                    foreach(var task in caseFile.Tasks)
                    {
                        var document = caseFile.Documents.Where(d => d.Path.Contains("/tasks/" + task.Id)).FirstOrDefault();
                        
                        if(document != null)
                            task.Documents.Add(document);
                    }
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
        [HttpGet("{caseFileId}")]
        public async Task<IActionResult> GetById(int caseFileId)
        {
            try
            {
                var contact = await _caseFilesService.GetByIdAsync(caseFileId);
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
        public async Task<IActionResult> Update([FromBody] CaseFileModel caseFile)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }

                var updatedCaseFile = await _caseFilesService.UpdateAsync(caseFile, currentUserId);

                for (int i = 0; i < caseFile.Documents.Count; i++)
                {
                    caseFile.Documents[i].CaseFileId = updatedCaseFile.Id;
                    caseFile.Documents[i].Path = "/cf" + updatedCaseFile.Id + "/" + caseFile.Documents[i].Path + "/entry-documents/" + caseFile.Documents[i].Name;
                    caseFile.Documents[i] = await _documentsService.UpdateAsync(caseFile.Documents[i], currentUserId);

                    updatedCaseFile.Documents.Add(caseFile.Documents[i]);
                }

                return Ok(updatedCaseFile);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CaseFileModel caseFile)
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                int currentUserId = 0;

                if (identity != null)
                {
                    currentUserId = Int32.Parse(identity.FindFirst("UserId").Value);
                }
                                
                var createdCaseFile = await _caseFilesService.CreateAsync(caseFile, currentUserId);

                for (int i = 0; i < caseFile.Documents.Count; i++)
                {
                    caseFile.Documents[i].CaseFileId = createdCaseFile.Id;
                    caseFile.Documents[i].Path = "/cf" + createdCaseFile.Id + "/" + caseFile.Documents[i].Path + "/entry-documents/" + caseFile.Documents[i].Name;
                    caseFile.Documents[i] = await _documentsService.CreateAsync(caseFile.Documents[i], currentUserId);

                    createdCaseFile.Documents.Add(caseFile.Documents[i]);
                }

                return Ok(createdCaseFile);
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

                var result = await _caseFilesService.DeleteAsync(contactId, currentUserId);

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
