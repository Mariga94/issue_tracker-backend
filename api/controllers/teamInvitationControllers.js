import TeamInvitation from "../models/InviteModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";
const generateInviteLink = () => {
  const crypto = require("crypto");
  const randomBytes = crypto.randomBytes(6).toString("hex");
  const inviteLink = `http://127.0.0.1:5173/teams/invite/${randomBytes}`;
  return inviteLink;
};

const generateToken = () => {
  const randomBytes = crypto.randomBytes(6).toString("hex");
  return randomBytes;
};
export const inviteUser = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  const token = generateToken();
  try {
    await TeamInvitation.create({ email, token });
    await TeamInvitation.sendInvitationEmail(email, token);
    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send invitation" });
  }
};

export const acceptInvitation = async (req, res) => {
  const { token, fullName, password } = req.body;

  try {
    const invitation = await TeamInvitation.findOne({ token });

    if (!invitation) {
      return res.status(404).json({ message: "Invalid invitation token" });
    }

    const existingUser = await User.findOne({ email: invitation.email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      email: invitation.email,
      fullName: fullName,
      password: password
    });

    await TeamInvitation.findOneAndDelete({ token });
    res
      .status(200)
      .json({ message: "Invitation accepted successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to accept invitation." });
  }
};
