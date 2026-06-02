import "./App.css";
import { SideBar } from "./components/index.js";
import { Outlet } from "react-router";
import socketConnection from "./utils/socket.js";
import { useEffect } from "react";
import Auth from "./backend/Auth.js";

function App() {
  
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await Auth.isAuthenticated();

      if (res.status === 200) {
        Auth.setUser(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  checkAuth();

  const disconnectSocket = socketConnection();

  return () => {
    disconnectSocket();
  };
}, []);

  return (
    <div className="min-h-screen bg-[#090909] text-slate-100">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_18%)]" />
        <div className="flex h-screen overflow-hidden">
          <div className="h-full w-80 flex-shrink-0">
            <SideBar className="h-full w-full" />
          </div>
          <main className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 lg:p-8">
            <div className="h-full overflow-y-auto rounded-[32px] border border-white/10 bg-[#0d0d0d] shadow-[0_30px_60px_-40px_rgba(255,255,255,0.16)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
