import express from "express";
import authUser from "../../middlewares/jwtAuthenticateUser.js";
import {acceptInvitation, inviteUser} from "../../controllers/teamInvitationControllers.js"
const router = express.Router();

// handle invitation request
router.post('/invite', authUser, inviteUser);

// handle invitation acceptance
router.post('/accept', authUser, acceptInvitation)

export default router