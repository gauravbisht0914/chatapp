import Message from "../../models/message.model.js";

async function messageHandler(socket) {
  socket.on(
    "sendMessage",
    async (payload = {}, callback) => {
      const { roomId, senderId, content, recipientId } = payload;
      const acknowledge = typeof callback === "function" ? callback : () => {};

      if (!roomId || !senderId || !content || !recipientId) {
        acknowledge({
          success: false,
          message: "RoomId, senderId, recipientId and content are required",
        });
        return;
      }

      try {
        const newMessage = await Message.create({
          senderId,
          recipientId,
          roomId,
          text: content,
        });

        acknowledge({ ...newMessage._doc });
        socket.to(String(recipientId)).emit("chat_event", newMessage);
      } catch (error) {
        console.error("Error while creating new message:", error);
        acknowledge({
          success: false,
          message: "Error while creating new message",
          roomId,
        });
      }
    },
  );
}

export default messageHandler;
