using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class WorkflowModel
    {
        public int Id { get; set; }
        public int Name { get; set; }
        public int Code { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public string IsActive { get; set; }        
    }
}
