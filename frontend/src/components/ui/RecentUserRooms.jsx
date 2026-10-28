import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { toggleRoomMuted } from "@/store/notificationSlice.js";

function RecentUserRooms({ className }) {
  const recentUserRooms = useSelector((state) => state.messageRoom ?? []);
  const currentUser = useSelector((state) => state.user);
  const mutedRoomIds = useSelector(
    (state) => state.notifications.mutedRoomIds,
  );
  const dispatch = useDispatch();

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
      className={`${className || ""} flex h-full flex-col border-r border-slate-200 bg-white`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Messages
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Recent chats</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-indigo-600">
          <ion-icon name="chatbubble-outline" class="text-lg" />
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {recentUserRooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            No chats yet. Start a conversation.
          </div>
        ) : (
          recentUserRooms.map((room) => {
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

            const isMuted = mutedRoomIds.includes(String(room?._id));

            return (
              <div
                key={room?._id || `${displayName}-${room?.createdAt}`}
                className="group flex items-center gap-1 rounded-[24px] border border-transparent pr-2 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <NavLink
                  to={`/chat/${room?._id}`}
                  className={({ isActive }) =>
                    `flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-[24px] p-3 transition ${
                      isActive
                        ? "bg-indigo-50"
                        : "bg-white group-hover:bg-slate-50"
                    }`
                  }
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-4xl bg-gradient-to-br from-white/15 to-white/5 text-sm font-semibold text-white">
                    <img
                      src={
                        avatarSrc ||
                        "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain"
                      }
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {displayName}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {formatTime(room?.latestMessage?.createdAt)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-slate-400">{preview}</p>
                  </div>
                </NavLink>
                <button
                  type="button"
                  onClick={() => dispatch(toggleRoomMuted(String(room?._id)))}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                  aria-label={`${isMuted ? "Unmute" : "Mute"} ${displayName}`}
                  title={`${isMuted ? "Unmute" : "Mute"} notifications`}
                >
                  <ion-icon
                    name={
                      isMuted
                        ? "notifications-off-outline"
                        : "notifications-outline"
                    }
                    class="text-lg"
                  />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default RecentUserRooms;
