using System;
using System.Diagnostics.Contracts;

namespace Daresoft.Core.Models
{
    public class UserProfileModel
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int ContactId { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string OtherName { get; set; }
        public string WorkEmail { get; set; }
        public string WorkPhone { get; set; }
        public string WorkPhoneExt { get; set; }
        public string MobilePhone { get; set; }
        public string? Color { get; set; }
        public string? ProfilePicture { get; set; }
        public string? ProfilePictureContentType { get; set; }
        public bool IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public int RoleId { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
        public string Password {  get; set; }
        public int TotalCount { get; set; }
    }
}
