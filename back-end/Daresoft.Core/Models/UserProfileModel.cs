using System;
using System.Diagnostics.Contracts;

namespace Daresoft.Core.Models
{
    public class UserProfileModel
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int ContactId { get; set; }
        public string? Color { get; set; }
        public string? ProfilePicture { get; set; }
        public string? ProfilePictureContentType { get; set; }
        public bool IsDeleted { get; set; }
        public bool? IsInactive { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public ContactModel? Contact { get; set; }
    }
}
