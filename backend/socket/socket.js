import { conversationHandler } from "./handlers/conversationHandler.js";


export function socketConnection(io) {

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });

        conversationHandler(socket)
    });
}