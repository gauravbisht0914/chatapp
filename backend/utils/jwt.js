import jwt from "jsonwebtoken";

export function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}
