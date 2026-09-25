import "./App.css";
import { SideBar, VideoCallDialogBox } from "./components/index.js";
import { Outlet } from "react-router";
import { checkUserAuth } from "./store/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "./pages";
import { fetchRecentMessageRooms } from "./store/messageRoomSlice";
import socketConnection from "@/utils/socket.js";


function App() {
  const user = useSelector((state) => state.user.isUserAuthenticated);
  const userD = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const hasInitialized = React.useRef(false);

  React.useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const verifyAuth = async () => {
      try {
       await dispatch(checkUserAuth());
       socketConnection()
        await dispatch(fetchRecentMessageRooms());
      } catch (error) {
        console.error(error);
      }
    };

    verifyAuth();
  }, [dispatch]);

  return user ? (
    <>
      {userD.incomingCallData && (
        <VideoCallDialogBox
          incomingCallOffer={userD.incomingCallData?.offer}
          callerData={userD.incomingCallData?.callerData}
          calleeData={userD.incomingCallData?.calleeData}
          roomId={userD.incomingCallData?.roomId}
          // onClose={() => dispatch(toggleCallActive({ callData: null }))}
        />
      )}
      <div className="h-screen overflow-hidden bg-[#f5f7fb] text-slate-900">
        <div className="flex h-full flex-col lg:flex-row">
          <SideBar className="order-2 h-[4.5rem] shrink-0 lg:order-1 lg:h-screen lg:w-64" />
          <main className="order-1 h-[calc(100vh-4.5rem)] min-h-0 flex-1 overflow-hidden p-3 pb-4 sm:p-5 lg:order-2 lg:h-screen lg:p-8">
            <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-45px_rgba(30,41,59,0.35)] sm:rounded-3xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  ) : (
    <LoginPage />
  );
}

export default App;
