import "./App.css";
import { SideBar } from "./components/index.js";
import { Outlet } from "react-router";
import { checkUserAuth } from "./store/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "./pages";
import { fetchRecentMessageRooms } from "./store/messageRoomSlice";

function App() {
  const user = useSelector((state) => state.user.isUserAuthenticated);
  const m = useSelector((state) => state.messageRoom);
  console.log(user);
  console.log(m)
  let dispatch = useDispatch();

  React.useEffect(() => {
    const verifyAuth = async () => {
      try {
        await dispatch(checkUserAuth());
        await dispatch(fetchRecentMessageRooms());
      } catch (error) {
        console.log(error);
      }
    };

    verifyAuth();
  }, [dispatch]);

  return user ? (
    <div className="bg-[#090909] h-full text-slate-100">
      <div className="h-full ">
        <div className="flex h-full overflow-hidden shrink-0">
          <div className="group">
            <div className="group-hover:fixed left-0 top-0 h-screen min-w-20 hover:w-64 duration-300 overflow-hidden  bg-black z-50">
              <SideBar className="h-full" />
            </div>
          </div>
          <main className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 lg:p-8">
            <div className="h-full overflow-y-auto rounded-[32px] border border-white/10 bg-[#0d0d0d] shadow-[0_30px_60px_-40px_rgba(255,255,255,0.16)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  ) : (
    <LoginPage />
  );
}

export default App;
