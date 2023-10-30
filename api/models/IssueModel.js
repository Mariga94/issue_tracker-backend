import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * @typedef {Object} Issue
 * @property {string} name - The name of the issue
 * @property {string} assignee - The user required to undertake the issue
 * @property {string} timeline - The duration of that will take to complete the issue
 * @property {string} issueType - The type of issue created e.g bug, improvement, task, new feature e.t.c
 * @property {string} status - The position of the issue e.g Open, In progress, In Review, Done e.t.c
 * @property {string} priority - The urgency of completion i.e Highest, High, Low, Lowest
 * @property {string} shortDesc - The summary of the issue
 * @property {string} longDesc - The detailed summary of the issue i.e. might include snapshots
 */
const issueSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    issueType: {
      type: String,
      enum: ["Bug", "Improvement", "Task", "New feature", "To Do"],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Open", "In progress", "In Review", "Done", "Completed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Highest", "High", "Low", "Lowest", "Medium"],
      default: "High",
      required: true,
    },
    summary: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    dueDate: {
      type: String,
      required: false,
    },
    reporter: {
      type: String,
      required: false
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    team: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
