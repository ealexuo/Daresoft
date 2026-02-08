using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        public int CaseFileId { get; set; }
        public int WorkflowId { get; set; }
        public string WorkflowName { get; set; }
        public string WorkflowCode { get; set; }
        public string? WorkflowColor { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? AssignedToUserId { get; set; }
        public string? TaskOwnerName { get; set; }
        public int Priority { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Reviewer { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public List<DocumentModel> Documents { get; set; }
    }
}
