using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daresoft.Core.Models
{
    public class SignInModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
    }
}
