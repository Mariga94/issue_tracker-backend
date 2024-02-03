import { Schema, Document, model } from "mongoose"

// Define the interface for the workspace document
export interface IComment extends Document {
    issueId: Schema.Types.ObjectId;
    text: string;
    user: Schema.Types.ObjectId;
    createdAt: Date;
}

// Define workspace schema
const commentSchema = new Schema<IComment>({
    issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
})

const CommentModel = model<IComment>("Comment", commentSchema);

export default CommentModel;
