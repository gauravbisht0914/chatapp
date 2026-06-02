import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function auth(req, res, next) {
  try {
    const accessToken = req.cookies.token;

    if (!accessToken) {
      return res.status(401).json({ error: "unauthorized" });
    }

    let decode;
    try {
      decode = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Invalid JWT- unauthorized" });
    }

    const user = await User.findById(decode.id).select(
      "_id username email profileImage isVerified createdAt updatedAt",
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid user - unauthorized" });
    }

    req.user = {
      ...user._doc,
      _id: user._id.toString(),
    };

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default auth;
