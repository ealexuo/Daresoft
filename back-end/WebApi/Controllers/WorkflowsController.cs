using Daresoft.Integrations.Documents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Daresoft.Core.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkflowsController : ControllerBase
    {
        private readonly IWorkflowsService _workflowsService;

        public WorkflowsController(IWorkflowsService workflowsService)
        {
            _workflowsService = workflowsService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {                
                var workflowsList = await _workflowsService.GetAllAsync();
                return Ok(workflowsList);
            }
            catch (Exception ex)
            {
                //ex.ToExceptionless().Submit();
                return StatusCode(500, ex.Message);
            }
        }
    }
}
