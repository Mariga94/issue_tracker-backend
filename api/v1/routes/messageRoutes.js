import express from "express";
import {
  createMessage,
  getMessage,
  getMessages,
} from "../../controllers/messageControllers.js";
import authUser from "../../middlewares/jwtAuthenticateUser.js";
const router = express.Router();

router.post("/", authUser, createMessage);
router.get("/:id", authUser, getMessages);
router.get("/:id", authUser, getMessage);

export default router;
