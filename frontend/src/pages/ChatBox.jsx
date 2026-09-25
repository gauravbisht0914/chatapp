import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { socket } from "../utils/socket.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { clearMessages, fetchMessages } from "@/store/messageSlice.js";
import { useDispatch } from "react-redux";
import messageHandler from "../utils/sockets/messageHandler.js";
import {
  RecentUserRooms,
  VideoCallDialogBox,
  Loader,
} from "@/components/index.js";

function ChatBubble({ message, isMe, otherUserImage }) {
  return (
    <div
      className={`chat-message flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {!isMe && otherUserImage && (
        <img
          src={otherUserImage}
          alt="user"
          className="h-8 w-8 rounded-full object-cover shrink-0"
        />
      )}
      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 my-px shadow-lg transition ${
          isMe
            ? "bg-indigo-600 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        <div className="text-sm leading-6">{message.text}</div>
        {/* <div className="mt-2 text-right text-[11px] text-slate-400">
          {new Date(message.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div> */}
      </div>
    </div>
  );
}

export default function ChatBox() {
  const roomId = useParams().id;
  console.log(roomId);
  const user = useSelector((state) => state.user);
  const storeMessages = useSelector((state) => state.message);
  const [loadingOlderChats, setLoadingOlderChats] = useState(false);

  const messagesRef = useRef(null);

  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [activeUser, setActiveUser] = useState({});

  const hasScrolledToBottom = useRef(false);
  const lastMessageRef = useRef(null);

  useLayoutEffect(() => {
    if (!messagesRef.current || storeMessages.length === 0) return;

    if (!hasScrolledToBottom.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }

    if (
      lastMessageRef.current &&
      lastMessageRef.current._id !== storeMessages[storeMessages.length - 1]._id
    ) {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }

    lastMessageRef.current = storeMessages[storeMessages.length - 1];
    hasScrolledToBottom.current = true;
  }, [storeMessages]); // this code will put the scroll to bottom when the component is mounted and when the storeMessages changes.

  useEffect(() => {
    dispatch(clearMessages());
    hasScrolledToBottom.current = false; // reset scroll flag when component remounts or roomId changes
    console.log("roomId", roomId);
    console.log("user._id", user);

    if (user._id && roomId) {
      socket.emit(
        "joinRoom",
        { roomIdByClient: roomId, recipients: [] },
        (response) => {
          console.log(response);
          if (response.roomData?._id) {
            setActiveUser({
              ...response.roomData.recipients.filter(
                (r) => r._id !== user._id,
              )[0],
              isUserActive: response.isUserActive,
            });
            
            dispatch(
              fetchMessages({
                roomId: response.roomData._id,
                offset: 0,
                limit: 20,
              }),
            );
          }
        },
      );
    }

    socket.on("user_presence_update", (userDetails) => {
      setActiveUser((prev) => {
        if (prev._id === userDetails.userId) {
          return { ...prev, isUserActive: userDetails.active };
        }
        return prev;
      });
    });
  }, [roomId, user._id]);

  function sendMessage() {
    if (!input.trim()) return;
    const next = {
      id: Date.now(),
      from: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setInput("");
    messageHandler({
      roomId,
      senderId: user._id,
      content: next.text,
      recipientId: activeUser._id,
    });
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const previousHeightRef = useRef(0);

  const handleScroll = async (e) => {
    if (e.currentTarget.scrollTop <= 50 && loadingOlderChats === false) {
      setLoadingOlderChats(true);
      previousHeightRef.current = messagesRef.current.scrollHeight;

      try {
        await dispatch(
          fetchMessages({
            roomId,
            offset: storeMessages.length,
            limit: 10,
          }),
        );
      } finally {
        setLoadingOlderChats(false);
      }
    }
  }; // this code will load older messages when the user scrolls to the top of the chat box.

  useLayoutEffect(() => {
    if (previousHeightRef.current && messagesRef.current) {
      const newHeight = messagesRef.current.scrollHeight;
      const diff = newHeight - previousHeightRef.current;

      if (diff > 0) {
        messagesRef.current.scrollTop += diff;
      }

      previousHeightRef.current = 0;
    }
  }, [storeMessages]); // this code will maintain the scroll position when older messages are loaded.

  const [startVideoCall, setStartVideoCall] = useState(false);
  function startCall() {
    if (!startVideoCall) {
      setStartVideoCall(true);
    }
  }
  console.log(activeUser);

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-white">
      <RecentUserRooms
        className={`${roomId ? "hidden lg:flex" : "flex"} w-full shrink-0 lg:w-[330px]`}
      />
      {roomId && activeUser ? (
        <div className="flex h-full min-w-0 w-full flex-col overflow-hidden bg-white animate-[fade-in_240ms_ease-out]">
          <div className="border-b border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeUser.profileImage?.url}
                  alt={activeUser?.username}
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-50"
                />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {activeUser.username}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Status:{" "}
                    <span
                      className={
                        activeUser.isUserActive
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }
                    >
                      {" "}
                      {activeUser.isUserActive ? "ACTIVE" : "INACTIVE"}{" "}
                    </span>
                    {/* <span className="text-white">{activeUser.status}</span> */}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => startCall(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  📞 Call
                </button>
                <button
                  onClick={() => startCall(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  🎥 Video
                </button>
              </div>
            </div>
          </div>

          <div
            ref={messagesRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 space-y-2 overflow-y-auto bg-slate-50 p-4 sm:p-6"
          >
            {loadingOlderChats ? <Loader /> : null}
            {storeMessages.map((message) => (
              <ChatBubble
                key={message._id}
                message={message}
                isMe={message.senderId === user._id}
                otherUserImage={activeUser.profileImage?.url}
              />
            ))}
          </div>

          <div className="flex-shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <label className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message…"
                  className="min-h-[3.5rem] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setInput("😀 " + input)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  😀
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-50 p-4 text-center text-slate-500">
          Select a conversation to start messaging
        </div>
      )}

      {startVideoCall && (
        <VideoCallDialogBox
          incomingCallOffer={null}
          callerData={user}
          calleeData={activeUser}
          roomId={roomId}
          toggleVideoCallDialogBox={setStartVideoCall}
        />
      )}
    </div>
  );
}
