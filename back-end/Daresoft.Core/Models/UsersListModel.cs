using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class UsersListModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string OtherName { get; set; }
        public string WorkEmail { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int TotalCount { get; set; }
    }
}
