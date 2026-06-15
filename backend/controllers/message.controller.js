import Message from "../models/message.model.js";

async function getMessages(req, res) {
  try {
    const { roomId } = req.params;
    const { offset, limit } = req.query;
    const user = req.user;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const messages = await Message.find({
      roomId,
      $or: [{ senderId: user._id }, { recipientId: user._id }],
    })
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }
    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export {
    getMessages,
}