import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import v1authRouter from "./routes/authRoutes.js";
import v1userRouter from "./routes/userRoutes.js";
import v1projectRouter from "./routes/projectRoutes.js";
import v1IssueRouter from "./routes/issueRoutes.js";
import v1TeamRouter from "./routes/teamRoutes.js";
import v1TeamInvitationRouter from "./routes/teamInvitationRoutes.js";
import v1Message from "./routes/messageRoutes.js";
import v1Workspace from "./routes/workspaceRoutes.js"
import { hostname } from "os";
import os from "os";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const IPAddress = getIPAddress();
const connectDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://joseph4muriuki:${process.env.MONGO_PWD}@cluster0.xsp2hkb.mongodb.net/?retryWrites=true&w=majority&dbname=bugtracker_db`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection made successfully to MongoDB!");
  } catch (error) {
    console.error(error);
  }
};

const allowedOrigins = [
  "https://issue-tracker-red.vercel.app/",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const corsOptions = {
  origin: allowedOrigins,
  optionSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/auth", v1authRouter);
app.use("/api/v1/users", v1userRouter);
app.use("/api/v1/project", v1projectRouter);
app.use("/api/v1/projects", v1IssueRouter);
app.use("/api/v1/issues", v1IssueRouter);
app.use("/api/v1/teams", v1TeamRouter);
app.use("/api/v1/teamInvitation", v1TeamInvitationRouter);
app.use("/api/v1/messages", v1Message);
app.use("/api/v1/workspaces", v1Workspace)

app.listen(PORT, hostname, IPAddress, () => {
  connectDatabase();
  console.log(`Express API running on ${hostname} ${PORT} on IP ${IPAddress}`);
});

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    let iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }
  return "0.0.0.0";
}
