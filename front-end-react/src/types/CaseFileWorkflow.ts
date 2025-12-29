
export type CaseFileWorkflow = {
    id: number;
    caseFileId: number;
    caseFileName: string;
    workflowId: number;
    workflowName: string;
    workflowStatusId: number;
    statusName: string;
    externalIdentifier: string;
    startDate: Date;
    endDate: Date | null;
}
