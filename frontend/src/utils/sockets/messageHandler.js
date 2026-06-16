import store from "@/store/store.js";
import { socket } from "../socket.js";
import { pushNewMessages } from "@/store/messageSlice.js";

function messageHandler({ roomId, senderId, content, recipientId }) {
  socket.emit(
    "sendMessage",
    {
      roomId,
      senderId,
      content,
      recipientId,
    },
    (data) => {
      store.dispatch(pushNewMessages(data));
    },
  );

}

export default messageHandler;
