import { Schema, Document, model } from "mongoose"

// Define the interface for the workspace document
export interface IProject extends Document {
    projectName: string;
    createdAt: Date;
    updatedAt: Date;
    owner: Schema.Types.ObjectId;
    issues: Schema.Types.ObjectId[];
}


// Define workspace schema
const projectSchema = new Schema<IProject>({
    projectName: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    issues: [{type: Schema.Types.ObjectId, ref: 'Issue'}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})


const ProjectModel = model<IProject>("Project", projectSchema);

export default ProjectModel;
