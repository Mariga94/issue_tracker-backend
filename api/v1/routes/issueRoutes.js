import express from "express";
import authUser from "../../middlewares/jwtAuthenticateUser.js";
import {
  assignIssueToAssignee,
  changeIssuePriority,
  changeIssueStatus,
  createIssue,
  getAllIssues,
  getAllIssuesByProjectId,
  getIssue,
  getOneIssue,
} from "../../controllers/issueControllers.js";
const router = express.Router();

// create a new issue for a specific project
router.post("/:projectId/issues", authUser, createIssue);
// get all the issues
router.get("/", authUser, getAllIssues);

router.get("/:id", authUser, getOneIssue);
// get all issues in a specific project ID
router.get("/:projectId/issues", authUser, getAllIssuesByProjectId);
//get a specified issue from a specified projectID
router.get("/:projectId/issues/:issueId", authUser, getIssue);
// assign an issue to a user
router.post(
  "/:projectId/issues/:issueId/assign",
  authUser,
  assignIssueToAssignee
);
// change status of an issue
router.post("/:projectId/issues/:issueId/status", authUser, changeIssueStatus);
// change issue priority
router.post(
  "/:projectId/issues/:issueId/priority",
  authUser,
  changeIssuePriority
);

router.put("/:id", authUser, changeIssueStatus);
export default router;
