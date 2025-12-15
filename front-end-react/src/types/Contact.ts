
export type Contact = {
    id: number;
    salutation: string; 
    name: string; 
    middleName: string; 
    lastName: string; 
    otherName: string;
    title: string;
    homeAddressLine1: string;
    homeAddressLine2: string;
    homeCity: string;
    homeState: string;
    homePostalCode: string;
    countryId: number;
    workAddressLine1: string;
    workAddressLine2: string;
    workCity: string;
    workState: string;
    workPostalCode: string;
    workCountry: string;
    workEmail: string;
    homeEmail: string;
    homePhone: string;
    workPhone: string;
    workPhoneExt: string;
    mobilePhone: string;
    companyId: number;
    contactTypeId: number;
    notes: string;
    preferredAddress: number;
    companyName: string;
    website: string;
    primaryContactId: number;
    isSupplier: boolean;
    isDeleted: boolean;    
}
