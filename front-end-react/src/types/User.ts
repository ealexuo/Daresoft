
export type User = {
    id: number;
    userName: string;
    contactId: number;
    name: string;
    middleName: string;
    lastName: string;
    otherName: string;
    workEmail: string;    
    workPhone: string;
    workPhoneExt: string;
    mobilePhone: string;
    color: string;
    profilePicture: string | null;
    profilePictureContentType: string | null;
    isDeleted: boolean;
    isActive: boolean; //
    isPasswordChangeRequired: boolean;
};
