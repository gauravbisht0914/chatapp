import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  isVerified: false,
  profilePicture: "",
  status: "offline",
  createdAt: "",
  updatedAt: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        username,
        email,
        isVerified,
        profilePicture,
        status,
        createdAt,
        updatedAt,
      } = action.payload;
      state.username = username;
      state.email = email;
      state.isVerified = isVerified;
      state.profilePicture = profilePicture;
      state.status = status;
      state.createdAt = createdAt;
      state.updatedAt = updatedAt;
    },
    clearUser: (state) => {
      state.username = "";
      state.email = "";
      state.isVerified = false;
      state.profilePicture = "";
      state.status = "offline";
      state.createdAt = "";
      state.updatedAt = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
