import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Messages from "@/backend/Messages";

const initialState = [
  //   {
  //     _id: "",
  //     senderId: "",
  //     recipientId: "",
  //     roomId: "",
  //     text: "",
  //     createdAt: "",
  //     updatedAt: "",
  //   },
];

export const fetchMessages = createAsyncThunk(
  "message/fetchMessagesStatus",
  async ({roomId, offset, limit}) => {
    console.log(roomId,offset,limit)
    const res = await Messages.fetchMessages(roomId, offset, limit);
    return res.data;
  },
);

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    pushNewMessages:(state,action)=>{
      state.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.push(...action.payload);
    });
  },
});

export const { pushNewMessages } = messageSlice.actions;
export default messageSlice.reducer;
