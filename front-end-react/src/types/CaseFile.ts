
export type CaseFile = {
    id: number;
    caseNumber: string; 
    name: string; 
    description: string; 
    supplierId: number;
    supplierName: string;
    supplierLastName: string;
    workflowId: number;
    workflowName: string;
    statusId: number;
    statusName: string;
    isActive: boolean;
    isDeleted: boolean;
    totalCount: number;    
}
