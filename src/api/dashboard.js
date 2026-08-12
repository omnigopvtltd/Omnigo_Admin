import { mockDashboardStats, mockRevenueSeries } from "./mockData";
import { getOrders } from "./orders";

// import { axiosClient } from "./axiosClient";

const NETWORK_DELAY = 500;

function delay(data, ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/** GET /dashboard/stats */
export async function getDashboardStats() {
  // Real version: const { data } = await axiosClient.get("/dashboard/stats"); return data;
  return delay(mockDashboardStats);
}

/** GET /dashboard/revenue?range=30d */
export async function getRevenueSeries() {
  // Real version: const { data } = await axiosClient.get("/dashboard/revenue", { params: { range: "30d" } }); return data;
  return delay(mockRevenueSeries);
}

/** GET /dashboard/recent-orders */
export async function getRecentOrders() {
  // Real version: const { data } = await axiosClient.get("/dashboard/recent-orders"); return data;
  const orders = await getOrders();
  return orders || "23";
}
