
import { CaseFileWorkflow } from "./CaseFileWorkflow";
import { Task } from "./Task";
import { Document } from "./Document";

export type CaseFile = {
    id: number;
    caseNumber: string; 
    name: string; 
    description: string; 
    supplierContactId: number;
    supplierName: string;
    supplierLastName: string;
    isActive: boolean;
    isDeleted: boolean;
    workflows: CaseFileWorkflow[];
    tasks: Task[];
    documents: Document[];
    createdDate?: Date;
    totalCount: number;
}
