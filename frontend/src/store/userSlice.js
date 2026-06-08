import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  email: "",
  isVerified: false,
  profilePicture: "",
  status: "offline",
  createdAt: "",
  updatedAt: "",
  currentRoomId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        _id,
        username,
        email,
        isVerified,
        profilePicture,
        status,
        createdAt,
        updatedAt,
      } = action.payload;

      state._id = _id;
      state.username = username;
      state.email = email;
      state.isVerified = isVerified;
      state.profilePicture = profilePicture;
      state.status = status;
      state.createdAt = createdAt;
      state.updatedAt = updatedAt;
    },
    setRoomId: (state, action) => {
      state.currentRoomId = action.payload;
    },
    clearUser: (state) => {
      state._id = "";
      state.username = "";
      state.email = "";
      state.isVerified = false;
      state.profilePicture = "";
      state.status = "offline";
      state.createdAt = "";
      state.updatedAt = "";
      state.currentRoomId = "";
    },
  },
});

export const { setUser, setRoomId, clearUser } = userSlice.actions;

export default userSlice.reducer;
