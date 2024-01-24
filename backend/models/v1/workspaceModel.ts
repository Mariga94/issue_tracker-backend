import { Schema, Document, model } from "mongoose"

// Define the interface for the workspace document
export interface IWorkspace extends Document {
    workspaceName: string;
    goals: string[];
    projects: string[];
    settings: string[];
    members: string[];
}


// Define workspace schema
const workspaceSchema = new Schema<IWorkspace>({
    workspaceName: { type: String, required: true },
    goals: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})


const WorkspaceModel = model<IWorkspace>("User", workspaceSchema);

export default WorkspaceModel;
