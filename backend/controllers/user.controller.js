import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";
import randomNumber from "../utils/randomNumber.js";
import validator from "validator";

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (!validator.isLength(username, { min: 2, max: 25 })) {
      return res
        .status(400)
        .json({ message: "Username must be between 2 and 25 characters" });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      username,
      email,
      password,
    });

    const verificationToken = randomNumber();

    newUser.emailVerificationToken = verificationToken;
    newUser.emailVerificationTokenExpiredAt = Date.now() + 15 * 60 * 1000;

    await newUser.save();

    const token = generateToken(newUser);
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function logoutUser(req, res) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ message: "Logged out successfully" });
}

async function verifyEmail(req, res) {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.emailVerificationToken !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.emailVerificationTokenExpiredAt < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiredAt = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

function isAuthenticated(req, res) {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export { createUser, loginUser, logoutUser, verifyEmail, isAuthenticated };
