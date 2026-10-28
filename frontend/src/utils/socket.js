import { updateMessageRoom } from "@/store/messageRoomSlice";
import { pushNewMessages } from "@/store/messageSlice";
import { toggleCallActive } from "@/store/userSlice";
import { addMessageNotification } from "@/store/notificationSlice";
import store from "@/store/store";
import { io } from "socket.io-client";
import callRingtone from "@/assets/ringtone.mp3";

export const audio = new Audio(callRingtone);

export function stopRingtone() {
  audio.pause();
  audio.currentTime = 0;
}

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
    const state = store.getState();
    const userId = state.user?._id;
    const isOwnMessage = String(data.senderId) === String(userId);
    const isFocusedRoom =
      String(state.notifications.focusedRoomId) === String(data.roomId);
    const room = state.messageRoom.find(
      (recentRoom) => String(recentRoom._id) === String(data.roomId),
    );

    if (isOwnMessage) return;

    if (isFocusedRoom) {
      store.dispatch(pushNewMessages(data));
    } else if (
      !state.notifications.mutedRoomIds.includes(String(data.roomId))
    ) {
      store.dispatch(
        addMessageNotification({
          id: data._id || `${data.roomId}-${data.createdAt}-${Date.now()}`,
          roomId: data.roomId,
          title: room?.otherUser?.username || "New message",
          message: data.text || "Sent you a message",
        }),
      );
    }

    store.dispatch(
      updateMessageRoom({
        newLatestMessageData: data,
      }),
    );
  }
};

export function socketConnection() {
  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("chat_event", handleChatEvent);

  if (socket.connected) {
    handleConnect();
  } else {
    socket.connect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("chat_event", handleChatEvent);
  };
}
export default socketConnection;
