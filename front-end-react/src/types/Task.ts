
export type Task = {
    id: number;
    caseFileId: number;
    name: string;
    description: string;
    assignedToUserId: number;
    priority: number;
    dueDate: Date;
    isCompleted: boolean;
    completedDate: Date;
}
