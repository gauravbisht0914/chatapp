import mongoose from "mongoose";
import RoomId from "../models/roomId.model.js";

// async function openRoom(req, res) {
//   try {
//     const { recipients, roomIdByClient } = req.body

//     let isRoomFound = null;
//     const userId = req.user._id;

//     if(!recipients && !roomIdByClient){
//       return res.status(400).json({
//         message: "recipients or room ID are required",
//       });
//     }

//     if(recipients && !Array.isArray(recipients)){
//       return res.status(400).json({
//         message: "recipients must be an array of user IDs",
//       });
//     }

//     if(roomIdByClient && mongoose.Types.ObjectId.isValid(roomIdByClient)){
//       isRoomFound = await RoomId.findById(roomIdByClient);
//       if(isRoomFound && isRoomFound.recipients.includes(userId)){
//         return res.status(200).json({
//           roomId: isRoomFound._id,
//         });
//       }
//     }

//     if(!recipients){
//       return res.status(400).json({
//         message: "Invalid RoomId",
//       });
//     }

//     if(recipients && !recipients.includes(userId)){
//       return res.status(400).json({
//         message: "User must be a participant in the room",
//       });
//     }

//     if(recipients && recipients.length < 2){
//       return res.status(400).json({
//         message: "At least 2 recipients are required to create a room",
//       });
//     }

//     if(recipients && recipients.length > 10){
//       return res.status(400).json({
//         message: "Maximum 10 recipients are allowed in a room",
//       });
//     }

//     if(recipients && recipients.length >= 2){
//       isRoomFound = await RoomId.findOne({
//         recipients: { $all: recipients }
//       });

//       if (isRoomFound && isRoomFound.recipients.includes(userId)) {
//         return res.status(200).json({
//           roomId: isRoomFound._id,
//         });
//       }
//     }

//     if(!isRoomFound && recipients && recipients.length >= 2){
//       const allValid = recipients.every((id) =>
//         mongoose.Types.ObjectId.isValid(id)
//       );
//       if (!allValid) {
//         return res.status(400).json({
//           message: "Invalid participant IDs",
//         });
//       }
//       const room = await RoomId.create({ recipients });
//       return res
//         .status(201)
//         .json({ message: "Room created successfully", roomId: room._id });
//     }

//   } catch (e) {
//     return res
//       .status(500)
//       .json({ message: e.message || "Error creating room" });
//   }
// }

// the above function is used in socket.io to create rooms