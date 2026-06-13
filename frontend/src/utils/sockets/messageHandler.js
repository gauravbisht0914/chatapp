import { socket } from "../socket.js";

function messageHandler({ roomId, senderId, content, recipientId }) {
  socket.emit(
    "sendMessage",
    {
      roomId,
      senderId,
      content,
      recipientId,
    },
    (response) => {
      console.log(response);
    },
  );

}

export default messageHandler;
