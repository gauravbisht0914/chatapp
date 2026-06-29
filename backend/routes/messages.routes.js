import express from "express";
import {
  getMessages,
  getUserRecentChats,
} from "../controllers/message.controller.js";
import auth from "../middlewares/auth.js";

const messagesRouter = express.Router();

messagesRouter.get("/d/:roomId", auth, getMessages);
messagesRouter.get("/getUserRecentChats", auth, getUserRecentChats);

export default messagesRouter;
