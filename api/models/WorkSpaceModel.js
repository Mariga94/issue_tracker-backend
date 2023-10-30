import mongoose from "mongoose";
import User from "./userModel.js";
import Project from "./projectModel.js";
const { Schema } = mongoose;

const workspaceSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

workspaceSchema.statics.createWorkspace = async function (name, userId) {
  try {
    const newWorkspace = new this({ name });
    const user = await User.findById(userId);
    newWorkspace.users.push(user);
    await newWorkspace.save();
    user.workspace.push(newWorkspace);
    await user.save();
    return newWorkspace;
  } catch (error) {
    throw new Error(error);
  }
};

workspaceSchema.statics.getWorkspaces = async function () {
  try {
    const workspaces = await this.find();
    return workspaces;
  } catch (error) {
    throw new Error(error);
  }
};

workspaceSchema.statics.getWorkspace = async function (workspaceId) {
  try {
    const workspace = await this.findById(workspaceId).populate({
      path: "projects",
      populate: {
        path: "user",
        select: "fullName",
      },
    }).populate({
      path: "users",
      select: "fullName _id"
    });
    return workspace;
  } catch (error) {
    throw new Error(error);
  }
};

workspaceSchema.statics.deleteWorkspace = async function (workspaceById) {
  try {
    const workspace = await this.findByIdAndDelete(workspaceById);
    const projects = workspace.projects;
    await Project.deleteMany({ _id: { $in: projects } });
    await Project.save();
    await this.save();
    console.log("Workspace and associated projects deleted successfully");
  } catch (err) {
    throw new Error(err);
  }
};

workspaceSchema.statics.inviteUserToWorkspace = async function (
  workspaceId,
  userEmail
) {
  try {
    const user = await User.findOne({ email: userEmail }).select("-password");
    const workspace = await this.findById(workspaceId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    workspace.users.push(user);
    await workspace.save();
    user.workspace.push(workspaceId);
    await user.save();
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

workspaceSchema.statics.removeUserFromWorkspace = async function (
  workspaceId,
  userId
) {
  try {
    const user = await User.findById(userId);
    const workspace = await this.findById(workspaceId);
    if (!user) {
      throw new Error("User doesn't exist");
    }
    if (!workspace) {
      throw new Error("Workspace doesn't exist");
    }
    const userIndex = workspace.users.indexOf(userId);
    if (userIndex === -1) {
      throw new Error("User not found in the workspace");
    }
    workspace.users.splice(userIndex, 1);
    const workspaceIndex = user.workspace.indexOf(workspaceId);
    if (workspaceIndex === -1) {
      throw new Error("Workspace doesn't exist");
    }
    user.workspace.splice(workspaceIndex, 1);
    await workspace.save();
    await user.save();
    return workspace;
  } catch (error) {
    throw new Error(error);
  }
};

workspaceSchema.statics.createProject = async function (
  workspaceId,
  projectName,
  userId
) {
  const workspace = await this.findById(workspaceId);
  if (!workspace) {
    throw new Error(`Workspace with the id ${workspaceId} not found!`);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User does not exist");
  }
  const newProject = new Project({ name: projectName, user, workspace });
  await newProject.save();
  workspace.projects.push(newProject);
  await workspace.save();
  user.projects.push(newProject);
  await user.save();
  return newProject;
};

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
