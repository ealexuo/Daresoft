import { Document } from "./Document";

export type Task = {
    id: number;
    caseFileId: number;
    workflowId: number;
    workflowName: string; 
    workflowCode: string; 
    workflowColor: string | null;
    name: string;
    description: string;
    assignedToUserId: number | null;
    taskOwnerName: string;
    priority: number;
    entryDate: Date;
    dueDate: Date;
    reviewer: string;
    isCompleted: boolean;
    completedDate: Date | null;    
    documents: Document[];
}
