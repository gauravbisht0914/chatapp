import roomId from "../../models/roomId.model.js";

async function roomHandler(socket) {
  socket.on("joinRoom", async (participantsId, cb) => {
    try {

      if (participantsId.length >= 2) {
        let room = await roomId.findOne({
          recipients: { $all: participantsId },
          $expr: {
            $eq: [{ $size: "$recipients" }, participantsId.length],
          },
        });

        if (!room) {
          room = await roomId.create({
            recipients: participantsId,
          });
        }

        socket.join(room._id.toString());

        cb({
          message: "Room joined successfully",
          roomId: room._id,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  });
}

export { roomHandler };
