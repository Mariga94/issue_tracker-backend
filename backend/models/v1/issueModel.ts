import { Schema, Document, model } from "mongoose"

// Define the interface for the issue document
export interface IIssue extends Document {
    project: Schema.Types.ObjectId,
    workspace: Schema.Types.ObjectId,
    issueType: "bug" | "task" | "new feature" | "improvement";
    priority: "high" | "medium" | "low";
    status: "todo" | "in progress" | "in review" | "done";
    summary: string;
    description: string;
    reporter?: Schema.Types.ObjectId | string;
    assignee?: Schema.Types.ObjectId;
    attachment?: string;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}


// Define issue schema
const issueSchema = new Schema<IIssue>({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    issueType: { type: String, enum: ["bug", "task", "new feature", "improvement"], default: 'task' },
    priority: { type: String, enum: ["high", "medium", "low"], default: 'medium' },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    attachment: [{ type: String, required: false }],
    dueDate: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})


const IssueModel = model<IIssue>("Issue", issueSchema);
export default IssueModel;
