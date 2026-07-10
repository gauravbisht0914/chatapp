import roomId from "../../models/roomId.model.js";
import mongoose from "mongoose";

async function roomHandler(socket) {
  socket.on("joinRoom", async ({ recipients, roomIdByClient }, cb) => {
    try {
      let room = null;
      console.log(socket)

      if (
        roomIdByClient &&
        roomIdByClient.trim() !== "" &&
        mongoose.Types.ObjectId.isValid(roomIdByClient)
      ) {
        const isRoomFound = await roomId.findById(roomIdByClient);
        if (isRoomFound) {
          if (!isRoomFound.recipients.includes(socket.user.id)) {
            return cb({
              error: "User is not a participant in the room",
              success: false,
            });
          }
          room = isRoomFound;
        }
      }

      if (!room) {
        if (!Array.isArray(recipients) || recipients.length > 2) {
          return cb({
            success: false,
            error: "Recipients must be an array of 2 recipient user IDs",
          });
        }

        room = await roomId.findOne({
          recipients: { $all: recipients },
          $expr: {
            $eq: [{ $size: "$recipients" }, recipients.length],
          },
        });

        if (!room) {
          room = await roomId.create({
            recipients: recipients,
          });
        }
      }

      socket.join(room._id.toString());

      const roomData = await roomId
        .findById(room._id)
        .populate("recipients", "username profileImage _id");

      cb({
        message: `Room joined successfully ${roomIdByClient}`,
        roomData: roomData,
      });
    } catch (err) {
      console.log(err.message);
    }
  });
}

export { roomHandler };
