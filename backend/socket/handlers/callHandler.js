async function callHandler(socket) {
  socket.on("call_made", async ({ offer, roomId, calleeData, callerData }) => {
    try {
      if (roomId) {
        socket.to(`${calleeData._id}`).emit("chat_event", {
          call: true,
          offer,
          calleeData,
          callerData,
          roomId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("call_accepted", async ({ offerAnswer, roomId }) => {
    socket.to(roomId).emit("call_response", { answer: offerAnswer, roomId });
  });

  socket.on("call_ended", async ({ roomId, reason }) => {
    socket.to(roomId).emit("call_ended", { roomId, reason });
  });

  socket.on("ice_candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice_candidate", { candidate });
  });
}

export default callHandler;
