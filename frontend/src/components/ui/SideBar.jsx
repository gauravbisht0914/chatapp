import { NavLink } from "react-router"
import { useSelector } from "react-redux"

function SideBar({ className }) {
  const user = useSelector(state=>state.user)
  console.log(user)
    const navStyle = ({ isActive }) =>
        `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${isActive
            ? 'bg-white/10 text-white shadow-lg shadow-white/5'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`

    return (
      <div className={`${className || "w-full"} gap-3`}>
        <div className=" h-full flex flex-col rounded-[32px] border border-white/10 p-3 shadow-2xl shadow-slate-950/30">
          <div className="flex-1 flex flex-col justify-center">
            <div>
              <nav className="space-y-1">
                <NavLink to="/chat/s" className={navStyle}>
                  <ion-icon name="chatbubble-outline" class="text-xl" />
                  <span className="group-hover:inline hidden">Chat</span>
                </NavLink>
                <NavLink to="/search" className={navStyle}>
                  <ion-icon name="search-outline" class="text-xl" />
                  <span className="group-hover:inline hidden">Search</span>
                </NavLink>
                <NavLink to="/settings" className={navStyle}>
                  <ion-icon name="settings-outline" class="text-xl" />
                  <span className="group-hover:inline hidden">Settings</span>
                </NavLink>
                <NavLink to="/notifications" className={navStyle}>
                  <ion-icon name="notifications-outline" class="text-xl" />
                  <span className="group-hover:inline hidden">
                    Notifications
                  </span>
                </NavLink>
              </nav>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 group-hover:p-4 mt-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-3xl bg-white/10 flex items-center justify-center text-white">
                <ion-icon name="person-circle-outline" class="text-2xl" />
              </div>
              <div className="group-hover:inline hidden">
              
                <p className="text-sm text-slate-400">Good afternoon</p>
                <p className="font-semibold text-white">
                  {user ? user.username : "User"}
                </p>
              </div>
            </div>
            <button className="group-hover:inline hidden mt-4 w-full rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
}

export default SideBar