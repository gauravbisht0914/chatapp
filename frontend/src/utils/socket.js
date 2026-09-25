import { updateMessageRoom } from "@/store/messageRoomSlice";
import { pushNewMessages } from "@/store/messageSlice";
import { toggleCallActive } from "@/store/userSlice";
import store from "@/store/store";
import { io } from "socket.io-client";
import callRingtone from "@/assets/ringtone.mp3";

export const audio = new Audio(callRingtone);

export const socket = io(`${import.meta.env.VITE_BACKEND_URL || ""}`, {
  autoConnect: false,
  withCredentials: true,
});
const handleConnect = () => {
  socket.emit("join_user_personal_room");
};

const handleDisconnect = (reason) => {
  console.log("Disconnected:", reason);
};

const handleChatEvent = (data) => {
  if (data.call) {
    console.log("INCOMING CALL TRIGGERED!");

    audio.loop = true;
    audio.play().catch(console.error);

    store.dispatch(toggleCallActive({ callData: data }));
  } else {
    store.dispatch(pushNewMessages(data));
    store.dispatch(
      updateMessageRoom({
        newLatestMessageData: data,
      }),
    );
  }
};

export function socketConnection() {
  if (!socket.connected) {
    socket.connect();
  }

  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("chat_event", handleChatEvent);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("chat_event", handleChatEvent);
  };
}
export default socketConnection;
