import express from "express";
import {
  createProject,
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
  inviteUserToWorkspace,
  removeUserFromWorkspace,
} from "../../controllers/workspaceControllers.js";
import authUser from "../../middlewares/jwtAuthenticateUser.js";
const router = express.Router();

router.post("/", authUser, createWorkspace);
router.get("/", authUser, getWorkspaces);
router.get("/:id", authUser, getWorkspace);
router.post("/:id", authUser, createProject);
router.delete("/:id", authUser, deleteWorkspace);
router.post("/invite/:id", authUser, inviteUserToWorkspace);
router.delete("/invite/:id", authUser, removeUserFromWorkspace);
export default router;
