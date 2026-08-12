import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { initiateCall, updateCallStatus } from "@/api/calls";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

// callState: "idle" | "calling" | "ringing" | "connected" | "ended" | "mic-test"
export function useCall() {
  const [callState, setCallState] = useState("idle");
  const [callId, setCallId] = useState(null);
  const [remoteName, setRemoteName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [micLevel, setMicLevel] = useState(0);
  const [error, setError] = useState("");

  const { socket, status: socketStatus, connect } = useSocket("/calls");
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const durationTimerRef = useRef(null);
  const analyserRef = useRef(null);
  const meterRafRef = useRef(null);
  const startedAtRef = useRef(null);

  const cleanupMeter = useCallback(() => {
    if (meterRafRef.current) cancelAnimationFrame(meterRafRef.current);
    analyserRef.current = null;
    setMicLevel(0);
  }, []);

  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    cleanupMeter();
  }, [cleanupMeter]);

  const closePeerConnection = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
  }, []);

  function runMicMeter(stream) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    function tick() {
      if (!analyserRef.current) return;
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setMicLevel(Math.min(100, Math.round((avg / 255) * 140)));
      meterRafRef.current = requestAnimationFrame(tick);
    }
    tick();
  }

  // Local-only microphone check — doesn't need a peer or a live server.
  // This is what actually runs end-to-end in this demo, since there's no
  // second connected client to place a real call to.
  const startMicTest = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      runMicMeter(stream);
      setCallState("mic-test");
    } catch (err) {
      setError(err.name === "NotAllowedError" ? "Microphone permission was denied." : "Couldn't access the microphone.");
    }
  }, []);

  const stopMicTest = useCallback(() => {
    stopLocalStream();
    setCallState("idle");
  }, [stopLocalStream]);

  // Real call flow — fully wired, but placing an actual call needs a
  // connected receiver on the other end of a live Socket.io server.
  const startCall = useCallback(async (receiverId, receiverDisplayName) => {
    setError("");
    setRemoteName(receiverDisplayName);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      runMicMeter(stream);

      const call = await initiateCall({ receiverId, receiverName: receiverDisplayName });
      setCallId(call._id);
      setCallState("calling");

      connect();

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0];
      };
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("call:ice-candidate", { callId: call._id, toUserId: receiverId, candidate: event.candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit("call:offer", { callId: call._id, toUserId: receiverId, sdp: offer });
    } catch (err) {
      setError(err.name === "NotAllowedError" ? "Microphone permission was denied." : "Couldn't start the call.");
      setCallState("idle");
    }
  }, [socket, connect]);

  const hangUp = useCallback(async () => {
    if (callId) {
      await updateCallStatus(callId, callState === "connected" ? "completed" : "missed", duration);
    }
    closePeerConnection();
    stopLocalStream();
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    setCallState("ended");
    setTimeout(() => setCallState("idle"), 1500);
  }, [callId, callState, duration, closePeerConnection, stopLocalStream]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => { t.enabled = isMuted; });
    setIsMuted((m) => !m);
  }, [isMuted]);

  // Duration ticker while connected
  useEffect(() => {
    if (callState === "connected") {
      startedAtRef.current = Date.now();
      durationTimerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 1000);
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callState]);

  // Incoming signaling (only fires with a live server + a real caller)
  useEffect(() => {
    if (!socket) return;

    async function onOffer({ callId: incomingCallId }) {
      setCallId(incomingCallId);
      setCallState("ringing");
      // A full accept flow would create the SDP answer here once the user
      // taps "Accept" — left as the next wiring step since there's no live
      // counterpart in this environment to test the handshake against.
    }
    async function onAnswer({ sdp }) {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
      setCallState("connected");
    }
    async function onIceCandidate({ candidate }) {
      try {
        await pcRef.current?.addIceCandidate(candidate);
      } catch {
        // ignore late/invalid candidates
      }
    }
    function onHangup() {
      closePeerConnection();
      stopLocalStream();
      setCallState("ended");
      setTimeout(() => setCallState("idle"), 1500);
    }

    socket.on("call:offer", onOffer);
    socket.on("call:answer", onAnswer);
    socket.on("call:ice-candidate", onIceCandidate);
    socket.on("call:hangup", onHangup);
    socket.on("call:rejected", onHangup);

    return () => {
      socket.off("call:offer", onOffer);
      socket.off("call:answer", onAnswer);
      socket.off("call:ice-candidate", onIceCandidate);
      socket.off("call:hangup", onHangup);
      socket.off("call:rejected", onHangup);
    };
  }, [socket, closePeerConnection, stopLocalStream]);

  useEffect(() => () => { closePeerConnection(); stopLocalStream(); }, [closePeerConnection, stopLocalStream]);

  return {
    callState, remoteName, isMuted, duration, micLevel, error, socketStatus,
    startCall, hangUp, toggleMute, startMicTest, stopMicTest, remoteAudioRef,
  };
}