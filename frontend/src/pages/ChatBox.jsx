import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { socket } from "../utils/socket.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { clearMessages, fetchMessages } from "@/store/messageSlice.js";
import { useDispatch } from "react-redux";
import messageHandler from "../utils/sockets/messageHandler.js";
import { RecentUserRooms, VideoCallDialogBox } from "@/components/index.js";

function ChatBubble({ message, isMe, otherUserImage }) {
  return (
    <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && otherUserImage && (
        <img
          src={otherUserImage}
          alt="user"
          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div
        className={`max-w-[75%] rounded-xl px-3 py-2 my-[1px] shadow-lg transition ${
          isMe
            ? "bg-white text-black"
            : "bg-[#141414] text-slate-100 border-white/10"
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
            setActiveUser(
              response.roomData.recipients.filter((r) => r._id !== user._id)[0],
            );
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
    setStartVideoCall(prev=>!prev);
  }

  return (
    <div className="flex h-full overflow-y-auto rounded-[32px] border border-white/10 bg-[#0d0d0d] shadow-[0_30px_60px_-40px_rgba(255,255,255,0.16)]">
      <RecentUserRooms className={"w-[400px]"}></RecentUserRooms>
      {roomId && activeUser ? (
        <div className="flex w-full h-full flex-col overflow-hidden rounded-[32px] bg-[#090909]">
          <div className="border border-white/10 bg-[#0f0f0f] p-4 shadow-2xl shadow-white/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeUser.profileImage?.url}
                  alt={activeUser?.username}
                  className="h-14 w-14 rounded-4xl object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Live chat
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    {activeUser.username}
                  </h2>
                  <p className="text-sm text-slate-400">
                    Status:{" "}
                    <span className="text-white">{activeUser.status}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => startCall(false)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-white text-black px-4 py-3 text-sm font-semibold transition hover:bg-slate-100"
                >
                  📞 Call
                </button>
                <button
                  onClick={() => startCall(true)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-white text-black px-4 py-3 text-sm font-semibold transition hover:bg-slate-100"
                >
                  🎥 Video
                </button>
              </div>
            </div>
          </div>

          <div
            ref={messagesRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto border border-white/10 bg-[#0b0b0b] p-2 shadow-inner shadow-white/10"
          >
            {loadingOlderChats ? (
              <div className="flex  justify-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : null}
            {storeMessages.map((message) => (
              <ChatBubble
                key={message._id}
                message={message}
                isMe={message.senderId === user._id}
                otherUserImage={activeUser.profileImage?.url}
              />
            ))}
          </div>

          <div className="flex-shrink-0  border border-white/10 bg-[#0f0f0f] p-4 shadow-2xl shadow-white/5">
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
                  className="min-h-[4.5rem] w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setInput("😀 " + input)}
                  className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  😀
                </button>
                <button
                  type="submit"
                  className="rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-[32px] border border-white/10 bg-[#0b0b0b] p-4 text-center text-slate-400 shadow-inner shadow-white/10">
          Select a chat to start messaging
        </div>
      )}

      {startVideoCall && (
        <VideoCallDialogBox
          incomingCallOffer={null}
          callerData={user}
          calleeData={activeUser}
          roomId={roomId}
        />
      )}

    </div>
  );
}
