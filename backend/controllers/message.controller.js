import Message from "../models/message.model.js";
import RoomId from "../models/roomId.model.js";
import mongoose from "mongoose";

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
      .sort({ createdAt: -1 })
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

async function getUserRecentChats(req, res) {
  try {
    const { _id } = req.user;

    const rooms = await RoomId.aggregate([
      {
        $match: {
          recipients: new mongoose.Types.ObjectId(_id),
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "roomId",
          as: "latestMessage",
          pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
        },
      },

      {
        $set: {
          latestMessage: { $arrayElemAt: ["$latestMessage", 0] },
          otherUserId: {
            $first: {
              $filter: {
                input: "$recipients",
                as: "r",
                cond: { $ne: ["$$r", new mongoose.Types.ObjectId(_id)] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "otherUser",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                "profileImage.url": 1,
              },
            },
          ],
        },
      },
      {
        $set: {
          otherUser: { $arrayElemAt: ["$otherUser", 0] },
        },
      },
      {
        $unset: "otherUserId",
      },
      {
        $sort: { "latestMessage.createdAt": -1, _id: 1 },
      },
    ]);

    return res.status(200).json(rooms);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Error fetching chats" });
  }
}

export { getMessages, getUserRecentChats };
