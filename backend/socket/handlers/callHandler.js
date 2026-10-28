const activeCallsByUser = new Map();
const activeCallsByRoom = new Map();
const activeCallsBySocket = new Map();

function releaseCall(call) {
  if (activeCallsByRoom.get(call.roomId) !== call) return;

  activeCallsByRoom.delete(call.roomId);
  if (activeCallsByUser.get(call.callerId) === call) {
    activeCallsByUser.delete(call.callerId);
  }
  if (activeCallsByUser.get(call.calleeId) === call) {
    activeCallsByUser.delete(call.calleeId);
  }
  activeCallsBySocket.delete(call.callerSocketId);
  activeCallsBySocket.delete(call.calleeSocketId);
}

async function callHandler(socket) {
  socket.on(
    "call_made",
    async ({ offer, roomId, calleeData, callerData, callType }) => {
      try {
        if (roomId) {
          const callerId = String(socket.user?._id ?? "");
          const calleeId = String(calleeData?._id ?? "");
          const busyCall =
            activeCallsByUser.get(callerId) ||
            activeCallsByUser.get(calleeId);

          if (!callerId || !calleeId || busyCall || callerId === calleeId) {
            socket.emit("call_busy", { reason: "User is busy" });
            return;
          }

          const call = {
            roomId: String(roomId),
            callerId,
            calleeId,
            callerSocketId: socket.id,
            calleeSocketId: null,
          };
          activeCallsByRoom.set(call.roomId, call);
          activeCallsByUser.set(callerId, call);
          activeCallsByUser.set(calleeId, call);
          activeCallsBySocket.set(socket.id, call);

          socket.to(`${calleeData._id}`).emit("chat_event", {
            call: true,
            offer,
            calleeData,
            callerData,
            roomId,
            callType,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  );

  socket.on("call_accepted", async ({ offerAnswer, roomId }) => {
    const call = activeCallsByRoom.get(String(roomId));
    if (call && String(socket.user?._id ?? "") === call.calleeId) {
      call.calleeSocketId = socket.id;
      activeCallsBySocket.set(socket.id, call);
    }
    socket.to(roomId).emit("call_response", { answer: offerAnswer, roomId });
  });

  socket.on("call_ended", async ({ roomId, reason }) => {
    const call = activeCallsByRoom.get(String(roomId));
    if (
      call &&
      [call.callerId, call.calleeId].includes(String(socket.user?._id ?? ""))
    ) {
      releaseCall(call);
    }
    socket.to(roomId).emit("call_ended", { roomId, reason });
  });

  socket.on("ice_candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice_candidate", { candidate });
  });

  socket.on("disconnect", () => {
    const call = activeCallsBySocket.get(socket.id);
    if (!call) return;

    const otherUserId =
      call.callerSocketId === socket.id ? call.calleeId : call.callerId;
    releaseCall(call);
    socket.to(otherUserId).emit("call_ended", {
      roomId: call.roomId,
      reason: "Connection lost",
    });
  });
}

export default callHandler;
