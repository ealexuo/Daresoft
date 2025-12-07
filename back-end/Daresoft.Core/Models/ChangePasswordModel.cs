using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class ChangePasswordModel
    {
        public string UserName { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
