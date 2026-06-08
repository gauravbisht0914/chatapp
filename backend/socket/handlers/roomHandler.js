import roomId from "../../models/roomId.model.js";

async function roomHandler(socket) {
  socket.on("joinRoom", async (participantsId, cb) => {
    try {
      // participantsId = participantsId.split(",").map((id) => id.trim());
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
