import React from "react";
import socketConnection from "../utils/socket.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../backend/Auth.js";
import { setUser } from "../store/userSlice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await Auth.isAuthenticated();
        console.log(res);
        if (res.status === 200) {
          console.log(res.data);
          dispatch(setUser(res.data));
        } else {
          console.log("loll");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();

    const disconnectSocket = socketConnection();

    return () => {
      disconnectSocket();
    };
  }, []);


  return children;


}

export default AuthProvider;
