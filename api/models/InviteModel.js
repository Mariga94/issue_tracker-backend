import nodemailer from "nodemailer";
import mongoose from "mongoose";
import crypto from "crypto";
import Mailgen from "mailgen";
import User from "./userModel.js";
const { Schema } = mongoose;

const teamInviteSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    // teamId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Team",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

teamInviteSchema.statics.sendInvitationEmail = async function (email, token) {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: "John Doe",
      intro: `You have been invited to join the bug tracker.`,
      action: {
        Instructions: "Click the following link to accept the invitation:",
        button: {
          color: 'green',
          text: 'Confirm Your Account',
          link: `http:localhost:5173/invite/${token}`,
        },
      },
    },
  };
  console.log(email);
  let mail = MailGenerator.generate(response);
  let message = {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome",
    html: mail,
  };

  transporter.sendMail(message);
};

const TeamInvitation = mongoose.model("TeamInvitation", teamInviteSchema);
export default TeamInvitation;
