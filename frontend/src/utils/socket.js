import { updateMessageRoom } from "@/store/messageRoomSlice";
import { pushNewMessages } from "@/store/messageSlice";
import { toggleCallActive } from "@/store/userSlice";
import store from "@/store/store";
import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_BACKEND_URL || ""}`, {
  autoConnect: false,
  withCredentials: true,
});

function socketConnection(userId) {
  socket.connect();

  socket.on("connect", () => {
    socket.emit("join_user_personal_room", {});
  });
  
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  

  socket.on("chat_event", (data) => {
    if (data.call) {
      console.log("Received call data:", data);
      store.dispatch(toggleCallActive({ callData: data }));
    }else{
      console.log("Received message:", data);
      store.dispatch(pushNewMessages(data));
      store.dispatch(updateMessageRoom({ newLatestMessageData: data }));
    }
  });

  return () =>{
      socket.off("connect")
      socket.off("disconnect")
      socket.off("chat_event")
  }
}

export default socketConnection;
