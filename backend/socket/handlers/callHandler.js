async function callHandler(socket) {
  socket.on("call_made", async ({ offer, roomId, calleeData, callerData }) => {
    try {
      if (roomId) {
        socket
          .to(`${calleeData._id}`)
          .emit("chat_event", {
            call: true,
            offer,
            calleeData,
            callerData,
            roomId,
          });
        console.log("call req emited ~~~");
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("call_accepted", async ({ offerAnswer, roomId }) => {
    console.log("call made accepted ~~~");
    socket.to(roomId).emit("call_reponse", { answer: offerAnswer, roomId });
    console.log("call made accepted Call back");
  });

  socket.on("ice_candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice_candidate", { candidate });
  });
}

export default callHandler;
