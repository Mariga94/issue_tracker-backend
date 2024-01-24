import { Schema, Document, model } from "mongoose"

// Define the interface for the workspace document
export interface ITeam extends Document {

  }


// Define workspace schema
const workspaceSchema = new Schema<ITeam>({})


const TeamModel = model<ITeam>("User", workspaceSchema);

export default TeamModel;
