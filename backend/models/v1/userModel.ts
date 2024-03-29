import mongoose, { Schema, Document, model } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  fullName: string;
  email: string;
  title: string;
  phoneNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastSignIn?: Date;
  firstSignIn: boolean;
  personalInfo: string;
  workspaces: Schema.Types.ObjectId[];
  projects: Schema.Types.ObjectId[];
  issues: Schema.Types.ObjectId[];
}

// Define the User schema
const userSchema = new Schema<IUser>({
  fullName: { type: String, required: false },
  title: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstSignIn: { type: Boolean, default: true },
  lastSignIn: { type: Date },
  personalInfo: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project', }],
  issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }]
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
