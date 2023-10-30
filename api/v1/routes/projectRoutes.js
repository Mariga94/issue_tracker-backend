import express from "express";
import {
  create,
  getProject,
  deleteProject,
  getAllProjects,
} from "../../controllers/projectControllers.js";
import authUser from "../../middlewares/jwtAuthenticateUser.js";
const router = express.Router();

router.post("/", authUser, create);
router.get("/:id", authUser, getProject);
router.get("/", authUser, getAllProjects);
router.delete("/:id", authUser, deleteProject);

export default router;
