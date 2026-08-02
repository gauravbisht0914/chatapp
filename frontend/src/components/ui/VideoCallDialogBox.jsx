import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../utils/socket.js";

function VideoCallDialogBox({ incomingCallOffer,callerData, calleeData, roomId }) {
  const [showCallToast, setShowCallToast] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [openCallDialog, setOpenCallDialog] = useState(true);

  const peerConnection = useRef(null);
  const stream = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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
    setShowCallToast(true);
    setTimeout(() => setShowCallToast(false), 2200);
    setOpenCallDialog(true);
    setShowVideo(true);
  }

  function cancelCall() {
    setShowVideo(false);
    setShowCallToast(false);
    setOpenCallDialog(false);
  }

  useEffect(() => {
    async function startLocalMedia() {
      try {
        stream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStream.current = stream.current;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream.current;
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function makeCall() {
      try {
        peerConnection.current = new RTCPeerConnection(config);

        socket.on("call_reponse", async (e) => {
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

        socket.emit("call_made", {
          offer: offer,
          roomId: roomId,
          calleeData: calleeData,
          callerData: callerData,
        });

        peerConnection.current.onconnectionstatechange = (event) => {
          if (peerConnection.current.connectionState === "connected") {
            console.log("PEER CONEECTED");
            console.log(event);
          }
        };

        peerConnection.current.ontrack = (event) => {
          console.log(event);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
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

        socket.on("ice_candidate", async ({ candidate }) => {
          try {
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
        if (e) {
          peerConnection.current = new RTCPeerConnection(config);

          peerConnection.current.ontrack = (event) => {
            console.log(event);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(e),
          );

          stream.current.getTracks().forEach((track) => {
            peerConnection.current.addTrack(track, stream.current);
          });
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          socket.emit("call_accepted", {
            offerAnswer: answer,
            roomId: roomId,
          });

          peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("ice_candidate", {
                candidate: event.candidate,
                roomId,
              });
            }
          };

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

    if (showVideo) {
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
    };
  }, [showVideo, incomingCallOffer, roomId, calleeData?._id]);

  if (!calleeData) return null;

  return (
    <>
      {openCallDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#0f0f0f] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-6">
            {showCallToast && (
              <div className="fixed bottom-6 right-6 rounded-3xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-slate-200 shadow-xl shadow-black/30">
                {isIncomingCall
                  ? `Joining ${displayName}’s call…`
                  : `Calling ${displayName}…`}
              </div>
            )}
            {!showVideo ? (
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
                        onClick={cancelCall}
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
                        Start call
                      </button>
                      <button
                        onClick={cancelCall}
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
                      src={calleeData.profileImage?.url}
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
                    onClick={cancelCall}
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
                  <div className="min-h-[18rem] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
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

export default VideoCallDialogBox;
