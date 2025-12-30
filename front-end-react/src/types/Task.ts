import { Document } from "./Document";

export type Task = {
    id: number;
    caseFileId: number;
    workflowId: number;
    name: string;
    description: string;
    assignedToUserId: number | null;
    priority: number;
    dueDate: Date;
    isCompleted: boolean;
    completedDate: Date | null;
    reviewer: string;
    documents: Document[];
}
