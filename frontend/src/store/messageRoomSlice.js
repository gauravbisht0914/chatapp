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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecentMessageRooms.fulfilled, (state, action) => {
      return action.payload
    });
  },
});

export const {} = messageRoomsSlice.actions
export default messageRoomsSlice.reducer