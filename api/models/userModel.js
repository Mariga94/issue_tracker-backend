import mongoose from "mongoose";
import Project from "./projectModel.js";
import Issue from "./IssueModel.js";
import Team from "./teamModel.js";

const { Schema } = mongoose;

/**
 * @typedef {Object} User
 * @property {string} firstName - The first name of the user
 * @property {string} secondName - The second name of the user
 * @property {string} email - Email of the user
 * @property {string} password - Password of the user
 * @property {string} profileImg - profile image of the user
 * @property {string} role - Role of the user i.e software engineer, project manager, Staff engineer, principal engineer e.t.c.
 * @property {string} projects - collections of user projects
 * @property {string} issues - collections of user issues
 *  */

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    githubId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project", unique: true }],
    },
    issues: {
      type: [{ type: Schema.Types.ObjectId, ref: "Issue", unique: true }],
    },
    workspace: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        unique: true,
      },
    ],
    teams: {
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

/**
 *
 * @param {string} projectName - The name of the new project
 * @returns {Promise<Project>} The created project
 * @throws {Error} if the new project could not be created
 */
userSchema.statics.createProject = async function (name, userId) {
  const newProject = new Project({ name, user: userId });
  await newProject.save();
  const user = await this.findById(userId);
  user.projects.push(newProject);
  user.save();
  return newProject;
};

/**
 *
 * @param {string} projectId - The ID of the project to get
 * @returns {Promise<Project>} - The project requested
 * @throws {Error} - if the project doesn't exist
 */
userSchema.statics.getProject = async function (projectId) {
  const project = Project.findById(projectId);
  if (!project) {
    throw Error("Project doesn't exist");
  }
  return project;
};

userSchema.statics.getAllProjects = async function () {
  const projects = await Project.find()
    .select("name key team type user issues createdAt updatedAt")
    .populate({
      path: "user",
      select: "fullName",
    });

  if (!projects.length === 0) {
    throw Error("No Available projects.");
  }
  return projects;
};

userSchema.statics.deleteProject = async function (projectId, userId) {};
/**
 *
 * @param {string} projectId - id of the project where the issue is going to be created
 * @param {string} name - The name of the issue
 * @param {string} assignedTo - The user to undertake the task
 * @param {string} issueType - The type of issue e.g bug or new feature
 * @param {string} timeline - The duration of the project
 * @param {string} status - The position of the project
 * @param {string} priority - The priority
 * @param {string} shortDesc - summary of the project
 * @param {string} longDesc  - The more detail summary of the project
 * @returns {Promise<Issue>} - The created Issue
 */
userSchema.statics.createIssue = async function (userId, projectId, data) {
  const user = await User.findById(userId);
  const project = await Project.findById(projectId);
  const newIssue = new Issue({
    user: user._id,
    creator: user._id,
    project: project._id,
    summary: data.summary,
    team: data.team,
    assignedTo: data.assignedTo,
    timeline: data.timeline,
    issueType: data.issueType,
    status: data.status,
    priority: data.priority,
    description: data.description,
    reporter: data.reporter,
    dueDate: data.dueDate,
  });
  newIssue.save();
  project.issues.push(newIssue);
  await project.save();
  user.issues.push(newIssue);
  await user.save();
  return newIssue;
};

userSchema.statics.getOneIssue = async function (projectId, issueId) {
  const project = await Project.findById(projectId);
  const issue = project.issues.find((issue) => issue.toString() === issueId);
  return await Issue.find(issue);
};

userSchema.statics.getIssue = async function (issueId) {
  try {
    const issue = await Issue.findById(issueId)
      .populate({ path: "assignedTo", select: "_id fullName email" })
      .populate({ path: "creator", select: "_id fullName email" })
      .populate("team")
      .populate({
        path: "user",
        select: "_id fullName email",
      });
    return issue;
  } catch (err) {
    throw new Error(`Can't fetch issue with ${issueId}`);
  }
};

/**
 *
 * @returns {Promise<issue>} - All the issues from the all the projects created
 */
userSchema.statics.getAllIssues = async function () {
  try {
    const issues = await Issue.find()
      .select(
        "project summary status issueType description team priority dueDate assignedTo createdAt updatedAt reporter creator"
      )
      .populate("assignedTo", "fullName");
    if (!issues) {
      throw new Error("No issues");
    }
    return issues;
  } catch (error) {
    throw new Error("An error occured when fetching issues");
  }
};

/**
 *
 * @param {string} projectId - The project ID that will return all the issues stored within
 * @returns {Promise<project.issues>} - The issues stored by the project ID
 */
userSchema.statics.getAllIssuesByProjectId = async function (projectId) {
  try {
    const project = await Project.findById(projectId).populate({
      path: "issues",
      populate: {
        path: "assignedTo",
        model: this,
      },
    });
    return project.issues;
  } catch (error) {
    throw new Error("Failed to return issues");
  }
};

/**
 *
 * @param {string} projectId - The ID  of the project the issue belongs to.
 * @param {string} issueId - The ID of the issue to be assigned.
 * @param {string} assignedTo - The ID of the user the issue is to be assigned
 * @returns {Promise<Issue>} - The updated issue
 */
userSchema.statics.assignIssue = async function (
  projectId,
  issueId,
  assignedToId
) {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error(`project not found`);
    }
    const user = await User.findById(assignedToId);
    if (!user) {
      throw new Error(`User not found`);
    }
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new Error(`Issue not found`);
    }
    issue.assignedTo = assignedToId;
    await issue.save();
    user.issues.push(issue);
    await user.save();
    const projectIndex = user.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`User not assigned to project with ID`);
    }
    user.projects[projectIndex].issues.push(issue);
    await user.save();
    return issue;
  } catch (err) {
    throw new Error(`Failed to assign task`);
  }
};

/**
 *
 * @param {string} issueId - The ID of the issue whose status is to be updated
 * @param {string} status - The status to be updated
 * @returns {Promise<issue>} - The updated issue
 * @throws {Error} - if issue could not be found or updated
 */
userSchema.statics.changeIssueStatus = async function (issueId, status) {
  try {
    const issue = await Issue.findByIdAndUpdate(issueId, { status: status });
    if (!issue) {
      throw new Error("Could not find issue");
    }
    await issue.save();
    console.log("Issue status updated successfully");
    return issue;
  } catch (error) {
    throw new Error("Could update issue status");
  }
};

/**
 *
 * @param {string} issueId - The ID of the issue
 * @returns
 */
userSchema.statics.changeIssuePriority = async function (issueId, priority) {
  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new Error("Could not find issue");
  }
  issue.priority = priority;
  console.log("Issue priority upated successfully");
  return issue;
};
/**
 *
 * @param {string} issueId - The ID of the issue to be approved.
 * @returns {Promise<Issue>} - the updated issue with done status.
 */
userSchema.statics.approveIssue = async function (issueId) {
  return this.changeIssueStatus(issueId, "Done");
};

/**
 *
 * @param {string} issueId - The ID of the issue to be rejected.
 * @returns {Promise<Issue>} - The udpated issue with rejected status.
 */
userSchema.methods.rejectIssue = async function (issueId) {
  return this.changeIssueStatus(issueId, "In progress");
};

/**
 *
 * @param {string} issueId - The ID of the issue to be reviewed
 * @returns {Promise<Issue>} - The updated issue with review status
 */
userSchema.methods.submitForReview = async function (issueId) {
  return this.changeIssueStatus(issueId, "Review");
};

/**
 *
 * @param {string} issueId - The ID of the issue whose issueType is to be updated
 * @param {string} issueType - The name of the issueType
 * @returns {Promise <issue>} - The updated Issue
 */
userSchema.methods.changeIssueType = async function (issueId, issueType) {
  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new Error("issueType cannot be found or updated.");
  }
  issue.issueType = issueType;
  await issue.save();
  console.log("Issue issueType successfully updated.");
  return issue;
};

/**
 *
 * @param {String} issueId - The ID of the issue whose issueType is to updated
 * @returns {Promise<Issue>} - The updated issueType High priority
 */
userSchema.methods.highPriority = async function (issueId) {
  return this.changeIssueType(issueId, "High");
};

/**
 *
 * @param {String} issueId - The ID of the issue whose issueType is to be updated
 * @returns {Promise<Issue>} - The updated issueType Highest priority
 */
userSchema.methods.highestPriority = async function (issueId) {
  return this.changeIssueType(issueId, "Highest");
};

/**
 *
 * @param {String} issueId - The ID of the issueType is to be updated
 * @returns {Promise<Issue>} - The updated issueType LOw priority
 */
userSchema.methods.lowPriority = async function (issueId) {
  return this.changeIssueType(issueId, "Low");
};

/**
 *
 * @param {String} issueId - The ID of the issueType is to be updated
 * @returns {Promise<Issue>} - The updated issueType lowest priority
 */
userSchema.methods.lowestPriority = async function (issueId) {
  return this.changeIssueType(issueId, "Lowest");
};

userSchema.statics.getUser = async function (userId) {
  try {
    const user = this.findById(userId)
      .select("-password")
      .populate({
        path: "teams",
        select: "-password",
        populate: { path: "members" },
      })
      .populate("projects")
      .populate("issues")
      .exec();
    return user;
  } catch (error) {
    throw new Error("Use cannot be found");
  }
};
const User = mongoose.model("User", userSchema);
export default User;
