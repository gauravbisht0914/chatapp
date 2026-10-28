import { useCallback, useEffect, useRef, useState } from "react";
import { socket, audio, stopRingtone } from "../../utils/socket.js";

const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

function CallDialogBox({
  incomingCallOffer,
  callerData,
  calleeData,
  roomId,
  callType = "Audio",
  toggleVideoCallDialogBox,
  onClose,
}) {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [openCallDialog, setOpenCallDialog] = useState(true);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState({
    isCallEnded: false,
    reason: "",
  });
  const [callRinging, setCallRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const peerConnection = useRef(null);
  const stream = useRef(null);
  const remoteStream = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const ringingTimeout = useRef(null);

  const isIncomingCall = Boolean(incomingCallOffer);
  const isVideoCall = callType === "Video";
  const callTypeLabel = isVideoCall ? "Video call" : "Audio call";
  const displayData = isIncomingCall ? callerData : calleeData;
  const displayName = displayData?.username || "Unknown User";

  function startCall() {
    stopRingtone();
    setOpenCallDialog(true);
    setIsCallStarted(true);
  }

  const cancelCall = useCallback((reason = "", notifyPeer = true) => {
    setIsCallStarted(false);
    if (notifyPeer) {
      socket.emit("call_ended", { roomId, reason });
    }
    setCallEnded({ isCallEnded: true, reason });
    setCallRinging(false);
    stopRingtone();
  }, [roomId]);

  useEffect(() => {
    const handleCallEnded = ({ reason }) => cancelCall(reason, false);
    const handleCallBusy = ({ reason }) =>
      cancelCall(reason || "User is busy", false);
    const handleCallResponse = async ({ answer }) => {
      if (answer && peerConnection.current) {
        stopRingtone();
        setCallRinging(false);
        clearTimeout(ringingTimeout.current);
        const remoteDesc = new RTCSessionDescription(answer);
        await peerConnection.current.setRemoteDescription(remoteDesc);
      }
    };
    const handleIceCandidate = async ({ candidate }) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        }
      } catch (error) {
        console.error("Error adding ICE candidate", error);
      }
    };

    socket.on("call_ended", handleCallEnded);
    socket.on("call_busy", handleCallBusy);
    socket.on("call_response", handleCallResponse);
    socket.on("ice_candidate", handleIceCandidate);

    async function startLocalMedia() {
      try {
        stream.current = await navigator.mediaDevices.getUserMedia({
          video: isVideoCall,
          audio: true,
        });

        localStream.current = stream.current;
      } catch (error) {
        console.error(error);
      }
    }

    async function makeCall() {
      try {
        audio.play().catch(console.error);
        audio.loop = true;
        setCallRinging(true);
        ringingTimeout.current = setTimeout(
          () => cancelCall("Not Picked"),
          15000,
        );
        peerConnection.current = new RTCPeerConnection(config);

        stream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream.current);
        });

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        peerConnection.current.onconnectionstatechange = () => {
          if (peerConnection.current.connectionState === "connected") {
            setCallAccepted(true);
            setCallRinging(false);
            clearTimeout(ringingTimeout.current);
            stopRingtone();
          }
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice_candidate", {
              candidate: event.candidate,
              roomId,
            });
          }
        };

        socket.emit("call_made", {
          offer: offer,
          roomId: roomId,
          calleeData: calleeData,
          callerData: callerData,
          callType,
        });

        peerConnection.current.ontrack = (event) => {
          remoteStream.current = event.streams[0];
        };
      } catch (error) {
        console.error(error);
      }
    }

    async function acceptCall(e) {
      try {
        stopRingtone();
        if (e) {
          peerConnection.current = new RTCPeerConnection(config);

          peerConnection.current.ontrack = (event) => {
            remoteStream.current = event.streams[0];
          };

          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(e),
          );

          peerConnection.current.onconnectionstatechange = () => {
            if (peerConnection.current.connectionState === "connected") {
              setCallAccepted(true);
            }
          };

          peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("ice_candidate", {
                candidate: event.candidate,
                roomId,
              });
            }
          };

          stream.current.getTracks().forEach((track) => {
            peerConnection.current.addTrack(track, stream.current);
          });

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          socket.emit("call_accepted", {
            offerAnswer: answer,
            roomId: roomId,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (isCallStarted) {
      if (incomingCallOffer) {
        startLocalMedia().then(() => acceptCall(incomingCallOffer));
      } else {
        startLocalMedia().then(() => makeCall());
      }
    } else if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
      localStream.current = null;
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    }

    return () => {
      clearTimeout(ringingTimeout.current);
      socket.off("call_ended", handleCallEnded);
      socket.off("call_busy", handleCallBusy);
      socket.off("call_response", handleCallResponse);
      socket.off("ice_candidate", handleIceCandidate);
    };
  }, [
    calleeData,
    callType,
    callerData,
    cancelCall,
    incomingCallOffer,
    isCallStarted,
    isVideoCall,
    roomId,
  ]);

  useEffect(() => {
    if (isVideoCall && localVideoRef.current && remoteVideoRef.current) {
      localVideoRef.current.srcObject = stream.current;
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream.current;
    }
  }, [callAccepted, isVideoCall]); // setting local and remote data when call gets accepted by another peer

  const toggleMute = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const toggleCamera = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOff(!videoTrack.enabled);
  };

  if (!calleeData) return null;

  if (openCallDialog) {
    if (callEnded.isCallEnded) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6">
          <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[24px] border border-white/10 bg-[#0f0f0f] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300">
                {callEnded.reason === "User is busy" ? "User is busy" : "Call ended"}
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center text-center sm:mt-6">
              <img
                src={displayData?.profileImage?.url}
                alt={displayName}
                className="h-16 w-16 rounded-4xl object-cover ring-2 ring-white/10"
              />
              <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-slate-400">
                Call details
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {displayName}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {isIncomingCall
                  ? `Incoming ${callTypeLabel.toLowerCase()}`
                  : `Outgoing ${callTypeLabel.toLowerCase()}`}
              </p>
            </div>

            <div className="mt-4 space-y-3 rounded-[22px] border border-white/10 bg-white/5 p-4 sm:mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                  {callEnded.reason}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">With</span>
                <span className="font-medium text-white">{displayName}</span>
              </div>
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Duration</span>
                <span className="font-medium text-white">{roomId || ""}</span>
              </div> */}
            </div>

            <button
              onClick={() =>{
                 setOpenCallDialog(false);
                 if (toggleVideoCallDialogBox) {
                   toggleVideoCallDialogBox(false);
                 }
                 if (onClose) {
                   onClose();
                 }
              }}
              className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 sm:mt-6"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {openCallDialog ? (
          <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-sm ${isVideoCall && callAccepted ? "p-0" : "p-2 sm:p-6"}`}>
            <div className={`w-full overflow-y-auto border border-white/10 bg-[#0f0f0f] shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${isVideoCall && callAccepted ? "flex h-[100dvh] max-h-[100dvh] max-w-none flex-col rounded-none p-0" : "max-h-[calc(100dvh-1rem)] max-w-4xl rounded-3xl p-3 sm:p-6 sm:rounded-4xl"}`}>
              {!callAccepted ? (
                <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-[#111111] px-4 py-8 text-center sm:min-h-[24rem] sm:rounded-[28px] sm:px-6 sm:py-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
                    <img
                      src={displayData.profileImage?.url}
                      alt={displayData?.username}
                      className="h-14 w-14 rounded-4xl object-cover ring-2 ring-white/20"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 sm:tracking-[0.35em]">
                    {isIncomingCall ? "Incoming call" : "Start a call"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    {isIncomingCall
                      ? `Join with ${displayName}`
                      : `Call ${displayName}`}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                    {isIncomingCall
                      ? `${isVideoCall ? "A video" : "An audio"} call is waiting for you. Join now and continue the conversation.`
                      : `Open a quick ${isVideoCall ? "video" : "audio"} chat with a calm, minimal experience.`}
                  </p>

                  <div className="mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:items-center">
                    {isIncomingCall ? (
                      <>
                        <button
                          onClick={startCall}
                          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                        >
                          Join call
                        </button>
                        <button
                          onClick={() => cancelCall("Declined")}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={startCall}
                          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                        >
                          {callRinging ? "Ringing....." : "Start call"}
                        </button>
                        <button
                          onClick={() => cancelCall("canceled")}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${isVideoCall ? "shrink-0 p-4 sm:px-6" : ""}`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          isIncomingCall
                            ? callerData.profileImage?.url
                            : calleeData.profileImage?.url
                        }
                        alt={displayName}
                        className="h-12 w-12 rounded-3xl object-cover ring-2 ring-white/10"
                      />
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm sm:tracking-[0.3em]">
                          {callTypeLabel}
                        </p>
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {displayName}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelCall("Call Ended")}
                      className="w-fit rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-400 sm:rounded-3xl"
                    >
                      End call
                    </button>
                  </div>

                  {isVideoCall ? (
                    <div className={`relative grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr] lg:gap-4 ${isVideoCall && callAccepted ? "mt-0 p-2 sm:p-4" : "mt-4"}`}>
                      <div className="h-full min-h-0 overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/80 p-2 shadow-inner shadow-slate-950/20 sm:rounded-[28px] sm:p-4">
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          className="h-full w-full rounded-[16px] object-cover sm:rounded-[20px]"
                        />
                      </div>
                      <div className="absolute bottom-3 right-3 z-10 h-[22%] max-h-40 w-[30%] max-w-36 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 shadow-xl lg:relative lg:bottom-auto lg:right-auto lg:h-full lg:max-h-none lg:w-auto lg:max-w-none lg:rounded-[28px]">
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full backdrop-blur-md lg:bottom-4 lg:gap-3">
                          <button
                            onClick={toggleMute}
                            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg text-red-600 transition hover:bg-white/30 sm:h-11 sm:w-11 sm:text-xl"
                          >
                            {isMuted ? (
                              <ion-icon name="mic-off"></ion-icon>
                            ) : (
                              <ion-icon name="mic"></ion-icon>
                            )}
                          </button>

                          <button
                            onClick={toggleCamera}
                            aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
                            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg ${isCameraOff ? "" : "text-red-600"} transition hover:bg-white/30 sm:h-11 sm:w-11 sm:text-xl`}
                          >
                            <ion-icon name="videocam"></ion-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex min-h-[14rem] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-slate-900/90 p-5 sm:mt-5 sm:min-h-[18rem] sm:rounded-[28px] sm:p-6">
                      <img
                        src={displayData?.profileImage?.url}
                        alt={displayName}
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10 sm:h-24 sm:w-24"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        {displayName}
                      </p>
                      <button
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                        className="mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-red-600 transition hover:bg-white/20 sm:mt-6"
                      >
                        {isMuted ? (
                          <ion-icon name="mic-off"></ion-icon>
                        ) : (
                          <ion-icon name="mic"></ion-icon>
                        )}
                      </button>
                    </div>
                  )}
                  {!isVideoCall && <audio ref={remoteAudioRef} autoPlay />}
                </>
              )}
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default CallDialogBox;
