import { roomHandler } from "./handlers/roomHandler.js";
import messageHandler from "./handlers/messageHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export function socketConnection(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });

    roomHandler(socket);
    messageHandler(socket);
  });

}
