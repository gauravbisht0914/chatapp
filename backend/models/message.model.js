import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomIdName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomId",
      required: true,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
