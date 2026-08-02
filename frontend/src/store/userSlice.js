/* eslint-disable preserve-caught-error */
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
  isUserAuthenticated: false,
  isCallActive: false,
  incomingCallData: null,
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
        isCallActive,
      } = action.payload;

      state._id = _id;
      state.username = username;
      state.email = email;
      state.isVerified = isVerified;
      state.profileImage = profileImage;
      state.status = status;
      state.createdAt = createdAt;
      state.updatedAt = updatedAt;
      state.isCallActive = isCallActive;
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
      state.isCallActive = false;
    },
    toggleCallActive: (state, action) => {
      const { callData } = action.payload;
      state.incomingCallData = callData;
      state.isCallActive = !state.isCallActive;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        console.log("FULLFILLED TRIGGER")
        let d = {
          ...state,
          ...action.payload,
          isUserAuthenticated: true,
        };
        console.log(d)
        console.log(state)
        return d
      })
      .addCase(checkUserAuth.rejected, (state) => {
        console.log('FAILEDD')
        state.isUserAuthenticated = false;
      });
  },
});

export const { setUser, clearUser, toggleCallActive } = userSlice.actions;
export default userSlice.reducer;
