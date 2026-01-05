using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class WorkflowModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public bool IsActive { get; set; }        
    }
}
