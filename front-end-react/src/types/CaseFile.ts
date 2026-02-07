
import { CaseFileWorkflow } from "./CaseFileWorkflow";
import { Task } from "./Task";
import { Document } from "./Document";

export type CaseFile = {
    id: number;
    caseNumber: string; 
    name: string; 
    description: string; 
    url?: string;
    supplierContactId: number;
    supplierName: string;
    supplierLastName: string;
    statusId?: number;
    statusName?: string;
    isActive: boolean;
    isDeleted: boolean;
    workflow: CaseFileWorkflow | null;
    templateValues: any[]; // TODO: Define a proper type for template values
    workflows: CaseFileWorkflow[]; // TODO: This seems redundant with the 'workflow' property. Consider refactoring.
    tasks: Task[];
    documents: Document[];
    createdDate?: Date;
    totalCount: number;
}
