async function messageHandler(socket) {
  try {
    socket.on("sendMessage", async ({ roomId, senderId, content }, cb) => {
      console.log("Received message:", { roomId, senderId, content });
      cb({
        message: "Message received successfully",
        roomId: roomId,
      });
    });
  } catch (err) {
    console.error("Error in messageHandler:", err.message);
  }
}

export default messageHandler;
