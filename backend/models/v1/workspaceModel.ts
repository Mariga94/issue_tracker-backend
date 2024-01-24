import { Schema, Document, model } from "mongoose"

// Define the interface for the workspace document
export interface IWorkspace extends Document {
    workspaceName: string;
    owner: Schema.Types.ObjectId;
    goals?: Schema.Types.ObjectId[];
    projects?: Schema.Types.ObjectId[];
    settings?: Schema.Types.ObjectId[];
    members?: Schema.Types.ObjectId[];
}


// Define workspace schema
const workspaceSchema = new Schema<IWorkspace>({
    workspaceName: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goals: [{ type: Schema.Types.ObjectId, ref: 'Goal', required: false }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
})


const WorkspaceModel = model<IWorkspace>("Workspace", workspaceSchema);

export default WorkspaceModel;
