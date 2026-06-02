import { roomHandler } from "./handlers/roomHandler.js";
import messageHandler from "./handlers/messageHandler.js";

export function socketConnection(io) {

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });

        roomHandler(socket)
        messageHandler(socket)
    });
}