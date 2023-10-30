import mongoose from "mongoose";
import User from "./userModel.js";
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Generate a unique invite link
teamSchema.statics.createTeam = async function (userId, teamName, memberEmail) {
  try {
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const newTeam = new this({
      name: teamName,
      members: [userId],
      creator: user._id,
    });
   
    const member = await User.findOne({ email: memberEmail }).exec();
    if (!member) {
      throw new Error("Member not found in the system");
    }
    newTeam.members.push(member._id);
    await newTeam.save();
    member.teams.push(newTeam);
    await member.save();
    user.teams.push(newTeam);
    user.save();
    return newTeam;
  } catch (error) {
    throw new Error(error);
  }
};

// Get a team by ID
teamSchema.statics.getTeam = async function (teamId) {
  try {
    const team = await Team.findById(teamId)
      .populate({
        path: "members",
        select: "-password",
      })
      .exec();
    return team;
  } catch (error) {
    throw new Error("Failed to retrieve the team");
  }
};

// get all teams
teamSchema.statics.getAllTeams = async function () {
  try {
    const teams = await Team.find()
      .populate({
        path: "members",
        select: "-password",
      })
      .exec();
    return teams;
  } catch (error) {
    throw new Error("Failed to retrieve teams");
  }
};

// Add a team member
teamSchema.statics.addTeamMember = async function (teamId, email) {
  try {
    const user = User.find({email});
    if (!user) {
      throw new Error('User doesn\'t exist')
    }
    const team = await Team.findByIdAndUpdate(
      teamId,
      {
        $push: {
          members: user._id,
        },
      },
      { new: true }
    );
    return team;
  } catch (error) {
    throw new Error("Failed to add the team member.");
  }
};

// Remove a team member
const removeTeamMember = async (teamId, memberId) => {
  try {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: memberId } },
      { new: true }
    );
    return team;
  } catch (error) {
    throw new Error("Failed to remove the team member.");
  }
};

const Team = mongoose.model("Team", teamSchema);
export default Team;
