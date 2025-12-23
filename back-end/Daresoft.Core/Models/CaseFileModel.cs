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
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierLastName { get; set; }
        public int WorkflowId { get; set; }
        public string WorkflowName { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int TotalCount { get; set; }
    }
}
