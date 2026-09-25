import { NavLink } from "react-router";
import { useSelector } from "react-redux";

function SideBar({ className }) {
  const user = useSelector((state) => state.user);

  const navStyle = ({ isActive }) =>
    `flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition lg:flex-none lg:justify-start lg:px-3.5 lg:py-3 lg:text-sm ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className={`${className || "w-full"}`}>
      <div className="flex h-full flex-col border-slate-200 bg-white p-2 shadow-[8px_0_30px_-28px_rgba(15,23,42,0.3)] lg:border-r lg:p-4">
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex h-full items-center lg:h-auto">
            <nav className="flex w-full items-center gap-1 lg:flex-col lg:items-stretch lg:gap-2">
              <NavLink to="/chat" className={navStyle}>
                <ion-icon name="chatbubble-outline" class="text-xl" />
                <span>Chat</span>
              </NavLink>
              <NavLink to="/search" className={navStyle}>
                <ion-icon name="search-outline" class="text-xl" />
                <span>Search</span>
              </NavLink>
              <NavLink to="/settings" className={navStyle}>
                <ion-icon name="settings-outline" class="text-xl" />
                <span>Settings</span>
              </NavLink>
              <NavLink to="/notifications" className={navStyle}>
                <ion-icon name="notifications-outline" class="text-xl" />
                <span className="hidden sm:inline lg:inline">
                  Notifications
                </span>
              </NavLink>
            </nav>
          </div>
        </div>

        <div className="mt-3 hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 lg:block">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <img
                src={user?.profileImage?.url}
                alt="Profile "
                className="h-10 w-10 rounded-xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user ? user.username : "User"}
              </p>
              <p className="text-xs text-slate-500">Your account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
