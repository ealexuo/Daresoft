import { Document } from "./Document";

export type Workflow = {
    id: number;
    name: string;
    code: string;
    description: string;
    color: string;
    isActive: boolean;
}
