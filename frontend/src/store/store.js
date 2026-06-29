import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import messageReducer from "./messageSlice";
import messageRoomsSlice from "./messageRoomSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    messageRoom: messageRoomsSlice,
  },
});

export default store;
