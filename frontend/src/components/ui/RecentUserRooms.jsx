import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

function RecentUserRooms({ className }) {
  const recentUserRooms = useSelector((state) => state.messageRoom ?? []);
  const currentUser = useSelector((state) => state.user);

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <aside
      className={`${className || ""} flex h-full flex-col border-r border-white/10 bg-[#0b0b0b]`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
            Messages
          </p>
          <h3 className="text-lg font-semibold text-white">Recent chats</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
          <ion-icon name="chatbubble-outline" class="text-lg" />
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {recentUserRooms.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">
            No chats yet. Start a conversation.
          </div>
        ) : (
          recentUserRooms.map((room) => {
            console.log(room);

            const displayName = room.otherUser?.username || "Unknown user";

            const avatarSrc =
              room.otherUser?.profileImage?.url ||
              room.otherUser?.profileImage ||
              "";
            const latestText =
              room?.latestMessage?.text || "Start a conversation";
            const preview =
              room?.latestMessage?.senderId === currentUser?._id
                ? `You: ${latestText}`
                : latestText;

            return (
              <NavLink
                to={`/chat/${room?.otherUser?._id}`}
                key={room?._id || `${displayName}-${room?.createdAt}`}
                className={({ isActive }) =>
                  `group flex cursor-pointer items-center gap-3 rounded-[24px] border p-3 transition ${
                    isActive
                      ? "bg-white/20 border-white/20"
                      : "bg-white/3 border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                  } `
                }
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-4xl bg-gradient-to-br from-white/15 to-white/5 text-sm font-semibold text-white">
                  <img
                    src={
                      avatarSrc ||
                      "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">
                      {displayName}
                    </p>
                    <span className="text-[11px] text-slate-500">
                      {formatTime(room?.updatedAt || room?.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-400">{preview}</p>
                </div>
              </NavLink>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default RecentUserRooms;
