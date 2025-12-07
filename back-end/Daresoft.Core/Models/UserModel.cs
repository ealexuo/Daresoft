using System;

namespace Daresoft.Core.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string OtherNames { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public bool RequiresPasswordChange { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public DateTime DateCreated { get; set; }    }
}
