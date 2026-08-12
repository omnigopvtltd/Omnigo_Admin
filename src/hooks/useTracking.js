// import { useQuery } from "@tanstack/react-query";
// import { getLiveRiders, getActiveDeliveries } from "@/api/tracking";

// export function useLiveRiders() {
//   return useQuery({
//     queryKey: ["tracking", "riders"],
//     queryFn: getLiveRiders,
//     refetchInterval: 3000, // simulates the live feel sockets would give for real
//   });
// }

// export function useActiveDeliveries() {
  //   return useQuery({
    //     queryKey: ["tracking", "deliveries"],
//     queryFn: getActiveDeliveries,
//     refetchInterval: 3000,
//   });
// }

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLiveRiders, getActiveDeliveries } from "@/api/tracking";
import io from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// export function useLiveRiders() {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       reconnectionAttempts: 5,
//     });

//     socket.on("connect", () => {
//       // Join admin tracking room to receive real-time updates
//       socket.emit("joinAdminTracking");
//     });

//     // Listen for 1-second real-time rider location updates
//     socket.on("riderLocationUpdated", (updatedRider) => {
//       queryClient.setQueryData(["tracking", "riders"], (oldRiders = []) => {
//         return oldRiders.map((rider) => {
//           if (rider.riderId === updatedRider.riderId) {
//             return {
//               ...rider,
//               location: updatedRider.location,
//               // Map lat/lng coordinates to visual percentage values if needed
//               x: updatedRider.location?.lng ?? rider.x,
//               y: updatedRider.location?.lat ?? rider.y,
//             };
//           }
//           return rider;
//         });
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [queryClient]);

//   return useQuery({
//     queryKey: ["tracking", "riders"],
//     queryFn: getLiveRiders,
//     staleTime: Infinity, // Rely on real-time sockets for updates
//   });
// }

export function useActiveDeliveries() {
  return useQuery({
    queryKey: ["tracking", "deliveries"],
    queryFn: getActiveDeliveries,
    refetchInterval: 10000, // Sync active orders list every 10s
  });
}


export function useLiveRiders(currentUserId) {
  const queryClient = useQueryClient();
  const { socket, status, connect } = useSocket(currentUserId, "/");

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!socket || status !== "connected") return;

    socket.emit("joinAdminTracking");

    socket.on("riderLocationUpdated", ({ riderId, location }) => {
      queryClient.setQueryData(["tracking", "riders"], (old = []) =>
        old.map((r) => (r.riderId === riderId ? { ...r, location } : r))
      );
    });

    return () => {
      socket.off("riderLocationUpdated");
    };
  }, [socket, status, queryClient]);

  return useQuery({
    queryKey: ["tracking", "riders"],
    queryFn: getLiveRiders,
    staleTime: Infinity,
  });
}

export function useCustomerOrderTracking(orderId, currentUserId) {
  const [trackingData, setTrackingData] = useState({
    riderLocation: null,
    telemetry: null,
  });
  const { socket, status, connect } = useSocket(currentUserId, "/");

  useEffect(() => {
    if (orderId) connect();
  }, [orderId, connect]);

  useEffect(() => {
    if (!socket || status !== "connected" || !orderId) return;

    socket.emit("joinOrderRoom", orderId);

    socket.on("liveRiderLocation", (data) => {
      setTrackingData({
        riderLocation: data.location,
        telemetry: data.telemetry,
      });
    });

    return () => {
      socket.emit("leaveOrderRoom", orderId);
      socket.off("liveRiderLocation");
    };
  }, [socket, status, orderId]);

  return trackingData;
}
////////////////////////////////////////

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