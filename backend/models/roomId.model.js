import mongoose from "mongoose";

const roomIdSchema = new mongoose.Schema(
  {
    participants: [
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
