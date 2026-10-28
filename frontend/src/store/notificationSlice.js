import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  focusedRoomId: null,
  notifications: [],
  mutedRoomIds: [],
  preferencesUserId: null,
  preferencesLoaded: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setFocusedRoom: (state, action) => {
      state.focusedRoomId = action.payload;
    },
    addMessageNotification: (state, action) => {
      state.notifications = [action.payload];
    },
    dismissMessageNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
    loadRoomPreferences: (state, action) => {
      state.preferencesUserId = action.payload.userId;
      state.mutedRoomIds = action.payload.mutedRoomIds;
      state.preferencesLoaded = true;
    },
    toggleRoomMuted: (state, action) => {
      const roomId = action.payload;
      if (state.mutedRoomIds.includes(roomId)) {
        state.mutedRoomIds = state.mutedRoomIds.filter((id) => id !== roomId);
      } else {
        state.mutedRoomIds.push(roomId);
      }
    },
  },
});

export const {
  setFocusedRoom,
  addMessageNotification,
  dismissMessageNotification,
  loadRoomPreferences,
  toggleRoomMuted,
} = notificationSlice.actions;
export default notificationSlice.reducer;
