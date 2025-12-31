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
        public int WorkflowColor { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? AssignedToUserId { get; set; }
        public int Priority { get; set; }
        public DateTime DueDate { get; set; }
        public string Reviewer { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public List<DocumentModel> Documents { get; set; }
    }
}
