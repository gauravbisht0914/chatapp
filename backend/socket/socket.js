import { roomHandler } from "./handlers/roomHandler.js";
import messageHandler from "./handlers/messageHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import callHandler from "./handlers/callHandler.js";

export function socketConnection(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user?._id);

    socket.on("join_user_personal_room", () => {
      socket.join(`${socket.user?._id?.toString()}`);
    }); // this is to join a personal room for the user, so that we can send messages to this user specifically
    
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.user?._id);
    });

    roomHandler(socket);
    messageHandler(socket);
    callHandler(socket);
  });
}
