import express from "express";
import {
  getUser,
  getUsers,
  deleteUser,
} from "../../controllers/userController.js";
const router = express.Router();

router.get("/:id", getUser);
router.get("/", getUsers);
router.delete("/:id", deleteUser);

export default router;
