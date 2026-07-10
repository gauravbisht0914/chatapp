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
]


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
    },
    clearMessages: () => {
     return [] ;
    },
  },
  extraReducers: (builder) => {
   builder.addCase(fetchMessages.fulfilled, (state, action) => {
     const map = new Map();

     [...action.payload.reverse(), ...state].forEach((message) => {
       map.set(message._id, message);
     });

     return [...map.values()];
   });
  },
});

export const { pushNewMessages, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
