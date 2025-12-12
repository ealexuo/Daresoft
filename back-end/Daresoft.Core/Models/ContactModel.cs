using System;
using System.Collections.Generic;
using System.Text;

namespace Daresoft.Core.Models
{
    public class ContactModel
    {
        public int Id { get; set; }
        public string Salutation { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string OtherName { get; set; }
        public string Title { get; set; }
        public string HomeAddressLine1 { get; set; }
        public string HomeAddressLine2 { get; set; }
        public string HomeCity { get; set; }
        public string HomeState { get; set; }
        public string HomePostalCode { get; set; }
        public int? CountryId { get; set; }
        public string WorkAddressLine1 { get; set; }
        public string WorkAddressLine2 { get; set; }
        public string WorkCity { get; set; }
        public string WorkState { get; set; }
        public string WorkPostalCode { get; set; }
        public string WorkCountry { get; set; }
        public string WorkEmail { get; set; }
        public string HomeEmail { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string WorkPhoneExt { get; set; }
        public string MobilePhone { get; set; }
        public int? CompanyId { get; set; }
        public int ContactTypeId { get; set; }
        public string Notes { get; set; }
        public int? PreferredAddress { get; set; }
        public string CompanyName { get; set; }
        public string Website { get; set; }
        public int? PrimaryContactId { get; set; }
        public bool IsSupplier { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
    }
}
