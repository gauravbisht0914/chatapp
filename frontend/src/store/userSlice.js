import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    username:"" ,
    email:"",
    isVerified:false,
    profilePicture:"",
    status:"offline",
};

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state, action) => {
            const { username, email, isVerified, profilePicture, status } = action.payload;
            state.username = username;
            state.email = email;
            state.isVerified = isVerified;
            state.profilePicture = profilePicture;
            state.status = status;
        },
        clearUser:(state) => {
            state.username = "";
            state.email = "";
            state.isVerified = false;
            state.profilePicture = "";
            state.status = "offline";
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;