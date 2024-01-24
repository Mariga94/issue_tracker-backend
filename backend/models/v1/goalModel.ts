import { Schema, Document, model } from "mongoose"

// Define the interface for the goal document
export interface IGoal extends Document {

  }


// Define goal schema
const goalSchema = new Schema<IGoal>({})


const GoalModel = model<IGoal>("User", goalSchema);

export default GoalModel;
