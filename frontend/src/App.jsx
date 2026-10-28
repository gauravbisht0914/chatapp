import "./App.css";
import { SideBar, CallDialogBox } from "./components/index.js";
import { Outlet } from "react-router";
import { checkUserAuth, clearIncomingCall } from "./store/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginPage } from "./pages";
import { fetchRecentMessageRooms } from "./store/messageRoomSlice";
import socketConnection from "@/utils/socket.js";
import {
  dismissMessageNotification,
  loadRoomPreferences,
} from "./store/notificationSlice.js";
import { Toast } from "./components/index.js";

function getMutedRoomIds(userId) {
  try {
    const storedPreferences = window.localStorage.getItem(
      `chatapp:mutedRooms:${userId}`,
    );
    if (!storedPreferences) return [];

    const mutedRoomIds = JSON.parse(storedPreferences);
    if (
      !Array.isArray(mutedRoomIds) ||
      mutedRoomIds.some((roomId) => typeof roomId !== "string")
    ) {
      throw new TypeError("Stored muted room preferences are invalid.");
    }

    return mutedRoomIds;
  } catch (error) {
    console.error("Unable to load muted room preferences:", error);
    return [];
  }
}

function App() {
  const user = useSelector((state) => state.user.isUserAuthenticated);
  const userD = useSelector((state) => state.user);
  const notifications = useSelector(
    (state) => state.notifications.notifications,
  );
  const roomPreferences = useSelector((state) => state.notifications);
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

  React.useEffect(() => {
    if (!userD.isUserAuthenticated || !userD._id) return;

    dispatch(
      loadRoomPreferences({
        userId: userD._id,
        mutedRoomIds: getMutedRoomIds(userD._id),
      }),
    );
  }, [dispatch, userD._id, userD.isUserAuthenticated]);

  React.useEffect(() => {
    if (
      !roomPreferences.preferencesLoaded ||
      roomPreferences.preferencesUserId !== userD._id ||
      !userD._id
    ) {
      return;
    }

    try {
      window.localStorage.setItem(
        `chatapp:mutedRooms:${userD._id}`,
        JSON.stringify(roomPreferences.mutedRoomIds),
      );
    } catch (error) {
      console.error("Unable to save muted room preferences:", error);
    }
  }, [
    roomPreferences.mutedRoomIds,
    roomPreferences.preferencesLoaded,
    roomPreferences.preferencesUserId,
    userD._id,
  ]);

  React.useEffect(() => {
    if (
      !userD.isUserAuthenticated ||
      !userD._id ||
      !roomPreferences.preferencesLoaded ||
      roomPreferences.preferencesUserId !== userD._id
    ) {
      return undefined;
    }

    return socketConnection();
  }, [
    roomPreferences.preferencesLoaded,
    roomPreferences.preferencesUserId,
    userD._id,
    userD.isUserAuthenticated,
  ]);

  return user ? (
    <>
      {notifications.map((notification) => (
        <Toast
          type="message"
          title={notification.title}
          message={notification.message}
          key={notification.id}
          onClose={() =>
            dispatch(dismissMessageNotification(notification.id))
          }
        />
      ))}
      {userD.incomingCallData && (
        <CallDialogBox
          key={userD.incomingCallData.offer?.sdp}
          incomingCallOffer={userD.incomingCallData?.offer}
          callerData={userD.incomingCallData?.callerData}
          calleeData={userD.incomingCallData?.calleeData}
          roomId={userD.incomingCallData?.roomId}
          callType={userD.incomingCallData?.callType}
          onClose={() => dispatch(clearIncomingCall())}
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
