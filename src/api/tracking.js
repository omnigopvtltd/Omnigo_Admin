// import { mockLiveRiders } from "./mockData";

// // import { axiosClient } from "./axiosClient";

// function delay(data, ms = 400) {
//   return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
// }

// function jitter(riders) {
//   // Simulates riders moving slightly each poll — replace with real socket
//   // events (see SOCKET_INTEGRATION.md) once a backend is connected.
//   return riders.map((r) => ({
//     ...r,
//     x: Math.min(94, Math.max(6, r.x + (Math.random() - 0.5) * 4)),
//     y: Math.min(94, Math.max(6, r.y + (Math.random() - 0.5) * 4)),
//   }));
// }

// let liveRiders = [...mockLiveRiders];

// /** GET /api/tracking/riders */
// export async function getLiveRiders() {
//   // Real version: const { data } = await axiosClient.get("/tracking/riders"); return data.riders;
//   liveRiders = jitter(liveRiders);
//   return delay(liveRiders);
// }

// /** GET /api/tracking/deliveries */
// export async function getActiveDeliveries() {
//   // Real version: const { data } = await axiosClient.get("/tracking/deliveries"); return data.deliveries;
//   const deliveries = liveRiders
//     .filter((r) => r.activeOrder)
//     .map((r) => ({ ...r.activeOrder, riderName: r.name, riderPhone: r.phone }));
//   return delay(deliveries);
// }

import { axiosClient } from "./axiosClient";

/** GET /api/tracking/riders */
export async function getLiveRiders() {
   try {
    const { data } = await axiosClient.get(`/tracking/riders`);
    
    console.log("API RESPONSE DATA:", data.riders); // Check if data is coming
    return data.riders;
    
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

/** GET /api/tracking/deliveries */
export async function getActiveDeliveries() {
   try {
    const { data } = await axiosClient.get(`/tracking/deliveries`);
    
    console.log("API RESPONSE DATA:", data.deliveries); // Check if data is coming
    return data.deliveries;
    
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}