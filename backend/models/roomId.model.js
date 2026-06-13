import mongoose from "mongoose";

const roomIdSchema = new mongoose.Schema(
  {
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const RoomId = mongoose.model("RoomId", roomIdSchema);

export default RoomId;
