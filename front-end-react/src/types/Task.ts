import { Document } from "./Document";

export type Task = {
    id: number;
    caseFileId: number;
    workflowId: number;
    workflowColor: string | null;
    name: string;
    description: string;
    assignedToUserId: number | null;
    priority: number;
    dueDate: Date;
    reviewer: string;
    isCompleted: boolean;
    completedDate: Date | null;    
    documents: Document[];
}
