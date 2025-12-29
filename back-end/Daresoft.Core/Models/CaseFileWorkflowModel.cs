using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class CaseFileWorkflowModel
    {        
        public int Id { get; set; }
        public int CaseFileId { get; set; }
        public string CaseFileName { get; set; } = string.Empty;
        public int WorkflowId { get; set; }
        public string WorkflowName { get; set; }
        public int WorkflowStatusId { get; set; }
        public string WorkflowStatusName { get; set; }
        public string ExternalIdentifier { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
