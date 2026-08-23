import React, { useEffect, useRef, useState } from "react";
import { socket, audio } from "../../utils/socket.js";

function VideoCallDialogBox({
  incomingCallOffer,
  callerData,
  calleeData,
  roomId,
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
  const ringingTimeout = useRef(null);

  console.log(callEnded);
  console.log(callEnded.reason);

  const config = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const isIncomingCall = Boolean(incomingCallOffer);
  const displayData = isIncomingCall ? callerData : calleeData;
  const displayName = displayData?.username || "Unknown User";

  function startCall() {
    setOpenCallDialog(true);
    setIsCallStarted(true);
  }

  function cancelCall(reason = "") {
    setIsCallStarted(false);
    socket.emit("call_ended", { roomId, reason });
    setCallEnded({ isCallEnded: true, reason: reason });
    setCallRinging(false);
    audio.pause();
    audio.currentTime = 0;
  }

  useEffect(() => {
    socket.on("call_ended", (e) => cancelCall(e.reason));
    async function startLocalMedia() {
      try {
        stream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
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

        socket.on("call_response", async (e) => {
          if (e.answer) {
            const remoteDesc = new RTCSessionDescription(e.answer);
            await peerConnection.current.setRemoteDescription(remoteDesc);
          }
        });

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
        });

        peerConnection.current.ontrack = (event) => {
          remoteStream.current = event.streams[0];
        };

        socket.on("ice_candidate", async ({ candidate }) => {
          try {
            console.log(candidate,".......")
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          } catch (err) {
            console.log("Error adding ICE candidate", err);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }

    async function acceptCall(e) {
      try {
        audio.pause();
        audio.currentTime = 0;
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

          socket.on("ice_candidate", async ({ candidate }) => {
            try {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(candidate),
              );
            } catch (err) {
              console.log("Error adding ICE candidate", err);
            }
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
      socket.off("call_reponse");
      socket.off("ice_candidate");
      socket.off("end_call");
      socket.off("call_ended");
    };
  }, [isCallStarted]);

  useEffect(() => {
    if (localVideoRef.current && remoteVideoRef.current) {
      localVideoRef.current.srcObject = stream.current;
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  }, [callAccepted]); // setting local and remote data when call gets accepted by another peer

  const toggleMute = () => {
    const audioTrack = localStream.current.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const toggleCamera = () => {
    const videoTrack = localStream.current.getVideoTracks()[0];

    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOff(!videoTrack.enabled);
  };

  if (!calleeData) return null;

  if (openCallDialog) {
    if (callEnded.isCallEnded) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#0f0f0f] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <div className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-300">
                Call ended
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
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
                {isIncomingCall ? "Incoming video call" : "Outgoing video call"}
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-[22px] border border-white/10 bg-white/5 p-4">
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Duration</span>
                <span className="font-medium text-white">{roomId || ""}</span>
              </div>
            </div>

            <button
              onClick={() =>{
                 setOpenCallDialog(false);
                 if (toggleVideoCallDialogBox) {
                   toggleVideoCallDialogBox(false);
                 }
              }}
              className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-4xl border border-white/10 bg-[#0f0f0f] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-6">
              {!callAccepted ? (
                <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#111111] px-6 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
                    <img
                      src={displayData.profileImage?.url}
                      alt={displayData?.username}
                      className="h-14 w-14 rounded-4xl object-cover ring-2 ring-white/20"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                    {isIncomingCall ? "Incoming call" : "Start a call"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {isIncomingCall
                      ? `Join with ${displayName}`
                      : `Call ${displayName}`}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                    {isIncomingCall
                      ? "A video call is waiting for you. Join now and continue the conversation."
                      : "Open a quick video chat with a calm, minimal experience."}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                          Video call
                        </p>
                        <h3 className="text-xl font-semibold text-white">
                          {displayName}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelCall("Call Ended")}
                      className="rounded-3xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                    >
                      End call
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                    <div className="min-h-[18rem] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-inner shadow-slate-950/20">
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full rounded-[20px] object-cover"
                      />
                    </div>
                    <div className="relative min-h-[18rem] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full backdrop-blur-md">
                        <button
                          onClick={toggleMute}
                          className="flex text-xl text-red-600 h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                        >
                          {isMuted ? (
                            <ion-icon name="mic-off"></ion-icon>
                          ) : (
                            <ion-icon name="mic"></ion-icon>
                          )}
                        </button>

                        <button
                          onClick={toggleCamera}
                          className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl ${isCameraOff ? null : "text-red-600"} transition hover:bg-white/20 `}
                        >
                          <ion-icon name="videocam"></ion-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default VideoCallDialogBox;
