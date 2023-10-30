import express from "express";
import authUser from "../../middlewares/jwtAuthenticateUser.js";
import {
  createTeam,
  getTeam,
  getTeams,
} from "../../controllers/teamControllers.js";
const router = express.Router();

// Get all teams you belong to
router.get("/", authUser, getTeams);
// Get one team
router.get("/:id", authUser, getTeam);
// Create one team
router.post("/", authUser, createTeam);

// router.post("/:id". authUser, AddTeamMember)
export default router;
