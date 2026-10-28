import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import messageReducer from "./messageSlice";
import messageRoomsSlice from "./messageRoomSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    messageRoom: messageRoomsSlice,
    notifications: notificationReducer,
  },
});

export default store;
