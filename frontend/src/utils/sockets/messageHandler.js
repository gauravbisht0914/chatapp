import store from "@/store/store.js";
import { socket } from "../socket.js";
import { pushNewMessages } from "@/store/messageSlice.js";
import { updateMessageRoom } from "@/store/messageRoomSlice.js";

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
      store.dispatch(updateMessageRoom({ newLatestMessageData: data }));
    },
  );

}

export default messageHandler;
