// import { useCallback, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// // Get current logged-in user ID from your auth context / state
// const currentUserId = user?._id;

// const SOCKET_URL = "http://localhost:5000";
// // const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// /**
//  * Thin wrapper around socket.io-client so pages can opt into a live
//  * connection without duplicating setup/teardown logic. Autoconnect is off
//  * until a real server exists — call `connect()` to try.
//  */
// export function useSocket(namespace = "/") {
//   const socketRef = useRef(null);
//   const [status, setStatus] = useState("idle"); // idle | connecting | connected | error

//   const connect = useCallback(() => {
//     if (socketRef.current?.connected) return;

//     setStatus("connecting");
//     const socket = io(`${SOCKET_URL}`, {
//       auth: {
//         userId: currentUserId,
//       },
//       autoConnect: true,
//       reconnectionAttempts: 2,
//       timeout: 4000,
//     });

//     socket.on("connect", () => setStatus("connected"));
//     socket.on("connect_error", () => setStatus("error"));
//     socket.on("disconnect", () => setStatus("idle"));

//     socketRef.current = socket;
//   }, [namespace]);

//   useEffect(() => {
//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, []);

//   return { status, connect, socket: socketRef.current };
// }


import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
// Get current logged-in user ID from your auth context / state
// const currentUserId = user?._id || "6a50f90383cbf83bbac2b5f2";
const currentUserId = "6a50f90383cbf83bbac2b5f2";

/**
 * Custom socket hook that attaches the logged-in user's ID
 * to the socket handshake on connection.
 */
export function useSocket(userId = null, namespace = "/") {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error

  const connect = useCallback(() => {
    // Prevent reconnecting if already connected
    if (socketRef.current?.connected) return;

    setStatus("connecting");

    const socket = io(`${SOCKET_URL}${namespace}`, {
      auth: {
        userId: currentUserId || undefined,
      },
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setStatus("error");
    });

    socket.on("disconnect", () => {
      setStatus("idle");
    });

    socketRef.current = socket;
  }, [userId, namespace]);

  // Clean up socket when component unmounts
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return { status, connect, socket: socketRef.current };
}