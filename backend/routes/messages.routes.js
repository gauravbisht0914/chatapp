import express from "express";
import { getMessages } from "../controllers/message.controller.js";
import auth from "../middlewares/auth.js";

const messagesRouter = express.Router();


messagesRouter.get("/:roomId", auth,getMessages);

export default messagesRouter;