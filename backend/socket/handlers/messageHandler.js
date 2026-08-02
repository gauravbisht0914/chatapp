import Message from "../../models/message.model.js";

async function messageHandler(socket) {
  try {
    socket.on(
      "sendMessage",
      async ({ roomId, senderId, content, recipientId }, cb) => {
        let newMessage;

        if (roomId && senderId && content) {
          newMessage = await Message.create({
            senderId: senderId,
            recipientId: recipientId,
            roomId: roomId,
            text: content,
          });
          if (!newMessage) {
            cb({
              success: false,
              message: "Error while creating new message",
              roomId: roomId,
            });
          }

          cb({
            ...newMessage._doc,
          });
        }

        cb({
          success: false,
          message: "RoomId, senderId and content are required",
        });

        socket.to(`${recipientId}`).emit("chat_event", newMessage);
      },
    );
  } catch (err) {
    console.error("Error in messageHandler:", err.message);
  }
}

export default messageHandler;
