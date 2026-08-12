import {
  updateProfilePicture,
  checkUsernameAvailability,
  checkEmailAvailability,
  updateProfileName,
  updatePassword,
} from "../controllers/userProfile.controller.js";
import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  verifyEmail,
  isAuthenticated,
  getUserDetails,
  findUserProfile,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../utils/multer.js";

const userRouter = express.Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", auth, logoutUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.get("/is-authenticated", auth, isAuthenticated);
userRouter.get("/getUserDetails/:userId", getUserDetails);
userRouter.get("/findUserProfile/users", findUserProfile);

userRouter.post("/update-profile-picture", upload.single('file'),auth, updateProfilePicture);
userRouter.post("/update-profile-name", auth, updateProfileName);
userRouter.get("/check-username", checkUsernameAvailability);
userRouter.get("/check-email", checkEmailAvailability);
userRouter.post("/update-password", auth, updatePassword);

export default userRouter;
