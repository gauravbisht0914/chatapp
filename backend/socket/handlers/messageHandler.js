import Message from "../../models/message.model.js";

async function messageHandler(socket) {
  try {
    socket.on(
      "sendMessage",
      async ({ roomId, senderId, content, recipientId }, cb) => {
        let newMessage;
        console.log("Received message:", {
          roomId,
          senderId,
          content,
          recipientId,
        });

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
            success: true,
            message: "Message received successfully",
            roomId: roomId,
          });
        }

        cb({
          success: false,
          message: "RoomId, senderId and content are required",
        });

        console.log(recipientId, roomId, newMessage);


        socket.to(roomId).emit(`${recipientId}`, newMessage);
      },
    );
  } catch (err) {
    console.error("Error in messageHandler:", err.message);
  }
}

export default messageHandler;
