import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Auth from "@/backend/Auth";
import socketConnection from "@/utils/socket.js";

const initialState = {
  _id: "",
  username: "",
  email: "",
  isVerified: false,
  profileImage: "",
  status: "offline",
  createdAt: "",
  updatedAt: "",
  currentRoomId: "",
  isUserAuthenticated: false,
};

export const checkUserAuth = createAsyncThunk(
  "user/userAuthStatus",
  async () => {
    const res = await Auth.isAuthenticated();
    if (res.status === 200) {
      socketConnection(res.data._id);
      return res.data;
    }
  },
);

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
        profileImage,
        status,
        createdAt,
        updatedAt,
      } = action.payload;

      state._id = _id;
      state.username = username;
      state.email = email;
      state.isVerified = isVerified;
      state.profileImage = profileImage;
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
      state.profileImage = "";
      state.status = "offline";
      state.createdAt = "";
      state.updatedAt = "";
      state.currentRoomId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          isUserAuthenticated: true,
        };
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isUserAuthenticated = false;
      });
  },
});

export const { setUser, setRoomId, clearUser } = userSlice.actions;
export default userSlice.reducer;
