using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class ContactModel
    {
        public int Id { get; set; }
        public string? Salutation { get; set; }
        public string? Name { get; set; }
        public string MiddleName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string Title { get; set; } = string.Empty;
        public string HomeAddressLine1 { get; set; } = string.Empty;
        public string HomeAddressLine2 { get; set; } = string.Empty;
        public string HomeCity { get; set; } = string.Empty;
        public string? HomeState { get; set; }
        public string HomePostalCode { get; set; } = string.Empty;
        public int? CountryId { get; set; }
        public string WorkAddressLine1 { get; set; } = string.Empty;
        public string WorkAddressLine2 { get; set; } = string.Empty;
        public string WorkCity { get; set; } = string.Empty;
        public string? WorkState { get; set; }
        public string WorkPostalCode { get; set; } = string.Empty;
        public string? WorkCountry { get; set; }
        public string WorkEmail { get; set; } = string.Empty;
        public string HomeEmail { get; set; } = string.Empty;
        public string? HomePhone { get; set; }
        public string? WorkPhone { get; set; }
        public string? MobilePhone { get; set; }
        public int? CompanyId { get; set; }
        public int ContactTypeId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public int PreferredAddress { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public string WorkPhoneExt { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public int? PrimaryContactId { get; set; }
        public bool? IsSupplier { get; set; }
        public ContactModel? PrimaryContact { get; set; }
    }
}
