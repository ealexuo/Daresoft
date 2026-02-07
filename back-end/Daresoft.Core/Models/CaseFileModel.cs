using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class CaseFileModel
    {
        public int Id { get; set; }
        public string CaseNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Url { get; set; }
        public int? SupplierContactId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierLastName { get; set; }
        public int? StatusId { get; set; }
        public string? StatusName { get; set; }
        public CaseFileWorkflowModel? Workflow { get; set; }
        public List<WorkflowTemplateValuesModel>? WorkflowTemplateValues { get; set; }
        public List<TaskModel> Tasks { get; set; }
        public List<DocumentModel> Documents { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public int TotalCount { get; set; } 
    }
}
