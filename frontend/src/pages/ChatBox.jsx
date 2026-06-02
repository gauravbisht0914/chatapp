import React, { useState, useRef, useEffect } from "react";
import { socket } from "../utils/socket.js";

function ChatBubble({ message, isMe }) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-[28px] px-5 py-3 my-2 shadow-lg transition ${
          isMe
            ? "bg-white text-black rounded-br-none"
            : "bg-[#141414] text-slate-100 rounded-bl-none border border-white/10"
        }`}
      >
        <div className="text-sm leading-6">{message.text}</div>
        <div className="mt-2 text-right text-[11px] text-slate-400">
          {message.time}
        </div>
      </div>
    </div>
  );
}

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, from: "them", text: "Hey! How are you?", time: "10:02 AM" },
    {
      id: 2,
      from: "me",
      text: "I'm good — building a cool chat UI.",
      time: "10:03 AM",
    },
    {
      id: 3,
      from: "them",
      text: "Nice! Want to try a quick video call?",
      time: "10:04 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [activeUser] = useState({
    id: "u2",
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/40?img=1",
    status: "online",
  });
  const [showVideo, setShowVideo] = useState(false);
  const [showCallToast, setShowCallToast] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const messagesRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, showVideo]);

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
    setMessages((prev) => [...prev, next]);
    setInput("");
    socket.emit(
      "sendMessage",
      { roomId: "", senderId: activeUser.id, content: next.text },
      (response) => {
        console.log(response);
      },
    );
    console.log(socket);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function startCall(isVideo) {
    setShowCallToast(true);
    setTimeout(() => setShowCallToast(false), 2200);
    if (isVideo) setShowVideo(true);
  }

  useEffect(() => {
    let mounted = true;
    async function startLocalMedia() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) return;
        setLocalStream(s);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("getUserMedia error", err);
        setShowVideo(false);
        alert("Unable to access camera/microphone. Please allow permissions.");
      }
    }

    if (showVideo) {
      startLocalMedia();
    } else if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }

    return () => {
      mounted = false;
    };
  }, [showVideo]);

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [localStream]);

  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-[32px] bg-[#090909] p-4 md:p-6">
      <div className="mb-5 rounded-[28px] border border-white/10 bg-[#0f0f0f] p-4 shadow-2xl shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="h-14 w-14 rounded-3xl object-cover ring-2 ring-white/20"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Live chat
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {activeUser.name}
              </h2>
              <p className="text-sm text-slate-400">
                Status: <span className="text-white">{activeUser.status}</span>
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
        className="flex-1 min-h-0 overflow-y-auto rounded-[32px] border border-white/10 bg-[#0b0b0b] p-4 shadow-inner shadow-white/10"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isMe={message.from === "me"}
          />
        ))}
      </div>

      <div className="mt-5 flex-shrink-0 rounded-[28px] border border-white/10 bg-[#0f0f0f] p-4 shadow-2xl shadow-white/5">
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

      {showCallToast && (
        <div className="fixed bottom-6 right-6 rounded-3xl bg-[#0d0d0d] px-4 py-3 text-sm text-slate-200 shadow-2xl shadow-white/10">
          Calling {activeUser.name}…
        </div>
      )}

      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl shadow-[#ffffff1a]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="h-12 w-12 rounded-3xl object-cover ring-2 ring-white/10"
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Video call
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {activeUser.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="rounded-3xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                End call
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <div className="min-h-[18rem] rounded-[28px] bg-slate-900/80 p-4 shadow-inner shadow-slate-950/20">
                <div className="flex h-full items-center justify-center rounded-[28px] border border-slate-800 bg-slate-950/60 text-center text-slate-400">
                  Remote video feed
                </div>
              </div>
              <div className="min-h-[18rem] rounded-[28px] overflow-hidden border border-slate-800 bg-slate-900/90">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
