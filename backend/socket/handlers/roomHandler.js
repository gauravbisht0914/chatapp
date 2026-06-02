import roomId from "../../models/roomId.model.js";

async function roomHandler(socket) {
  socket.on("createRoom", async (participantsId, cb) => {
    try {
      let room = await roomId.findOne({
        participants: {
          $all: participantsId,
        },
      });

      if (!room) {
        room = await roomId.create({
          participants: participantsId,
        });
      }

      socket.join(room._id.toString());

      cb({
        message: "Room joined successfully",
        roomId: room._id,
      });
    } catch (err) {
      console.log(err.message);
    }
  });
}

export { roomHandler };
