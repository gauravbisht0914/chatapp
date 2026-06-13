import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomId",
      required: true,
    },
    roomIdName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomId",
    },
    text: {
      type: String,
      trim: true,
      required: true,
    },
    media: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
