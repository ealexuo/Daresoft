
export type Task = {
    id: number;
    caseFileId: number;
    workflowId: number;
    name: string;
    description: string;
    assignedToUserId: number;
    priority: number;
    dueDate: Date;
    isCompleted: boolean;
    completedDate: Date;
}
