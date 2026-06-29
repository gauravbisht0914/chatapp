import RoomId from "../models/roomId.model.js";

async function createRoom(req, res) {
  try {
    const { participants } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({
        message: "At least 2 participants are required to create a room",
      });
    }

    const room = await RoomId.create({ participants });

    return res
      .status(201)
      .json({ message: "Room created successfully", roomId: room._id });
  } catch (e) {
    return res
      .status(500)
      .json({ message: error.message || "Error creating room" });
  }
}

// the above function is used in socket.io to create rooms