import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import Mail from "nodemailer/lib/mailer/index.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists try Signing In!");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });
    await newUser.save();

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
        name: `Hi ${newUser.fullName}`,
        intro: "You have successfully created an account.",
      },
    };

    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: "adeline5@ethereal.email",
      subject: "Welcome",
      html: mail,
    };

    transporter.sendMail(message);

    res.status(201).send("User successfully created.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something Went Wrong!");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Account doesn't exist!");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send("Invalid Credentials");
    } else {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
          fullName: user.fullName,
          role: user.role,
        },
        process.env.JWT_KEY
      );
      // const { email, _id, ...info } = user._doc;
      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        })
        .status(200)
        .send({
          email: user._doc.email,
          _id: user._doc._id,
          fullName: user._doc.fullName,
        });
    }
  } catch (err) {
    res.status(500).send("Something is wrong");
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out");
};
