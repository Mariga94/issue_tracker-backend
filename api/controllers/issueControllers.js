import User from "../models/userModel.js";
import Issue from "../models/IssueModel.js";

// create an issue
export const createIssue = async (req, res) => {
  try {
    const userId = req.userId;
    const projectId = req.params.projectId;
    const { ...data } = req.body;
    const issue = await User.createIssue(userId, projectId, data);
    res.send(issue).status(201);
  } catch (error) {
    res.send("Something is wrong").status(500);
  }
};
// modify an issue
export const updateIssue = async (req, res) => {};
//get one issue
export const getIssue = async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  const getOneIssue = await User.getOneIssue(projectId, issueId);
  res.send(getOneIssue);
};
// get all issues and can be filted
export const getAllIssues = async (req, res) => {
  try {
    const allIssues = await User.getAllIssues();
    res.send(allIssues).status(200);
  } catch (err) {
    res.send("Something is wrong").status(500);
  }
};

export const getAllIssuesByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const allIssuesByProjectId = await User.getAllIssuesByProjectId(projectId);
    res.send(allIssuesByProjectId).status(200);
  } catch (error) {
    console.log(error.message);
  }
};

// assign Issue
export const assignIssueToAssignee = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const issueId = req.params.issueId;
    const assignedToId = req.body.assignedTo;
    const issue = await User.assignIssue(projectId, issueId, assignedToId);
    // res.send({
    //   projectId: projectId,
    //   issueId: issueId,
    //   assignedTo: assignedTo,
    // });
    res.send(issue).status(200);
  } catch (err) {
    res.send("Something went wrong").status(500);
  }
};
// change an issue status
export const changeIssueStatus = async (req, res) => {
  try {
    const issueId = req.params.id;
    const status = req.body.status;

    await User.changeIssueStatus(issueId, status);
    res.status(200).send("Status updated");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};
// change issue priority
export const changeIssuePriority = async (req, res) => {
  try {
    const issueId = req.params.issueId;
    const priority = req.body.priority;
    const issue = await User.changeIssuePriority(issueId, priority);
    res.send(issue).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

export const getOneIssue = async (req, res) => {
  try {
    const issue = await User.getIssue(req.params.id);
    res.status(200).send(issue);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
};
