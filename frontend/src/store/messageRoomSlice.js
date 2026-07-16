import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import Messages from "@/backend/Messages";
import { messageSlice } from "./messageSlice";

export const fetchRecentMessageRooms = createAsyncThunk(
  "message/fetchRecentMessageRoomsStatus",
  async () => {
    console.log();
    const res = await Messages.getUserRecentChats();
    return res.data;
  },
);

export const messageRoomsSlice = createSlice({
  name: "messageRooms",
  initialState: [],
  reducers: {
    clearMessageRooms: () => {
      return [];
    },
    updateMessageRoom: (state, action) => {
      const { newLatestMessageData } = action.payload;
      const index = state.findIndex(
        (room) => room._id === newLatestMessageData.roomId,
      );
      if (index === -1) return;

      const [room] = state.splice(index, 1);
      room.latestMessage = newLatestMessageData;
      state.unshift(room);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecentMessageRooms.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { clearMessageRooms,updateMessageRoom } = messageRoomsSlice.actions;
export default messageRoomsSlice.reducer;