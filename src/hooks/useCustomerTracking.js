import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useCustomerTracking(orderId) {
  const [riderLocation, setRiderLocation] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("trackOrder", orderId);
    });

    socket.on("liveRiderLocation", (data) => {
      setRiderLocation(data.location);
      if (data.telemetry) {
        setTelemetry(data.telemetry);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return { riderLocation, telemetry, isConnected };
}