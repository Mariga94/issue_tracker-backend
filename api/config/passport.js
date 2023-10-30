import passport, { Passport } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {Strategy as GithubStrategy} from "passport-github";
import User from "../models/userModel.js";

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user);
})

passport.use()

const generateInviteLink = () => {
    const crypto = require("crypto");
    const randomBytes = crypto.randomBytes(6).toString("hex");
    const inviteLink = `http://127.0.0.1:5173/teams/invite/${randomBytes}`;
    return inviteLink;
  };