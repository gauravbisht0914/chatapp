import "./App.css";
import { SideBar, VideoCallDialogBox } from "./components/index.js";
import { Outlet } from "react-router";
import { checkUserAuth } from "./store/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "./pages";
import { fetchRecentMessageRooms } from "./store/messageRoomSlice";

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
      <div className="bg-[#090909] h-full text-slate-100">
        <div className="h-full ">
          <div className="flex h-full overflow-hidden shrink-0">
            <div className="group">
              <div className="group-hover:fixed group-hover:left-0 group-hover:top-0 h-screen min-w-20 hover:w-64 duration-300 overflow-hidden bg-black z-50">
                <SideBar className="h-full" />
              </div>
            </div>
            <main className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 lg:p-8">
              <div className="h-full overflow-y-auto rounded-4xl border border-white/10 bg-[#0d0d0d] shadow-[0_30px_60px_-40px_rgba(255,255,255,0.16)]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  ) : (
    <LoginPage />
  );
}

export default App;
