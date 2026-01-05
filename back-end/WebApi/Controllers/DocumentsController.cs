using Daresoft.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Daresoft.Integrations.Documents;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly ITasksService _tasksService;
        private readonly IDocumentsService _documentsService;
        private readonly IWorkflowsService _workflowsService;

        public DocumentsController(ITasksService tasksService, IDocumentsService documentsService, IWorkflowsService workflowsService)
        {
            _tasksService = tasksService;
            _documentsService = documentsService;
            _workflowsService = workflowsService;
        }

        [Authorize]
        [HttpGet("read-url/{documentId}")]
        public async Task<IActionResult> GetRead(int documentId)
        {
            try
            {
                MicrosoftAzure documentIntegration = new MicrosoftAzure();
                var document = await _documentsService.GetByIdAsync(documentId);
                var company = "arael";

                var documentURL = documentIntegration.GetReadURL(company + document.Path);

                return Ok(documentURL);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpGet("upload-url/{documentId}")]
        public async Task<IActionResult> GetUpload(int documentId)
        {
            try
            {
                MicrosoftAzure documentIntegration = new MicrosoftAzure();
                var document = await _documentsService.GetByIdAsync(documentId);
                var company = "arael";

                var documentURL = documentIntegration.GetUploadURL(company + document.Path);

                return Ok(documentURL);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }
    }
}
