import {
  mockRevenueSeries, mockRestaurantEarnings, mockRiderEarnings,
  mockWithdrawRequests, mockTransactions,
} from "./mockData";

import { axiosClient } from "./axiosClient";

let withdrawRequests = [...mockWithdrawRequests];
let transactions = [...mockTransactions];

function delay(data, ms = 450) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

/** GET /api/finance/revenue?range= */
export async function getRevenueOverview({ range = "30d" } = {}) {
  // Real version: const { data } = await axiosClient.get("/finance/revenue", { params: { range } }); return data;
 
  try {
    const { data } = await axiosClient.get(`/finance/revenue`, {
      params: { range },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
 
  // const totalRevenue = mockRevenueSeries.reduce((sum, d) => sum + d.revenue, 0);
  // const totalOrders = mockRevenueSeries.reduce((sum, d) => sum + d.orders, 0);

  // return delay({
  //   range,
  //   summary: {
  //     totalRevenue,
  //     totalOrders,
  //     avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
  //     totalTax: Math.round(totalRevenue * 0.025),
  //     totalDeliveryFees: Math.round(totalOrders * 3.2),
  //     totalDiscount: Math.round(totalRevenue * 0.04),
  //   },
  //   series: mockRevenueSeries.map((d) => ({ date: d.date, revenue: d.revenue, orders: d.orders })),
  // });
}

/** GET /api/finance/restaurant-earnings */
export async function getRestaurantEarnings({ search, page = 1, limit = 8 } = {}) {
  // Real version: const { data } = await axiosClient.get("/finance/restaurant-earnings", { params: {...} }); return data;

   try {
    const { data } = await axiosClient.get(`/finance/restaurant-earnings`, {
      params: { search, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
  // let results = mockRestaurantEarnings;
  // if (search) {
  //   const q = search.toLowerCase();
  //   results = results.filter((r) => r.name.toLowerCase().includes(q));
  // }
  // const total = results.length;
  // const start = (page - 1) * limit;
  // return delay({ earnings: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}


/** GET /api/finance/rider-earnings */
export async function getRiderEarnings({ search, page = 1, limit = 8 } = {}) {
  // Real version: const { data } = await axiosClient.get("/finance/rider-earnings", { params: {...} }); return data;

 try {
    const { data } = await axiosClient.get(`/finance/rider-earnings`, {
      params: { search, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
  // let results = mockRiderEarnings;
  // if (search) {
  //   const q = search.toLowerCase();
  //   results = results.filter((r) => r.name.toLowerCase().includes(q));
  // }
  // const total = results.length;
  // const start = (page - 1) * limit;
  // return delay({ earnings: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** GET /api/finance/commission */
export async function getCommissionSummary({ range = "30d" } = {}) {
  // Real version: const { data } = await axiosClient.get("/finance/commission", { params: { range } }); return data;

   try {
    const { data } = await axiosClient.get(`/finance/commission`, {
      params: { range },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
  // const totalCommission = mockRestaurantEarnings.reduce((sum, r) => sum + r.commissionAmount, 0);
  // const totalGrossSales = mockRestaurantEarnings.reduce((sum, r) => sum + r.grossSales, 0);
  // return delay({
  //   range,
  //   totalCommission,
  //   totalGrossSales,
  //   breakdown: [...mockRestaurantEarnings]
  //     .sort((a, b) => b.commissionAmount - a.commissionAmount)
  //     .map((r) => ({ restaurantId: r.restaurantId, name: r.name, commissionRate: r.commissionRate, grossSales: r.grossSales, commission: r.commissionAmount })),
  // });
}

/** GET /api/finance/withdrawals?status=&type=&page=&limit= */
export async function getWithdrawRequests({ status, type, page = 1, limit = 8 } = {}) {
  // Real version: const { data } = await axiosClient.get("/finance/withdrawals", { params: {...} }); return data;

 try {
    const { data } = await axiosClient.get(`/finance/withdrawals`, {
      params: { status, type, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
  // let results = withdrawRequests;
  // if (status && status !== "all") results = results.filter((r) => r.status === status);
  // if (type === "rider") results = results.filter((r) => !!r.riderId);
  // if (type === "restaurant") results = results.filter((r) => !!r.restaurantId);

  // results = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // const total = results.length;
  // const start = (page - 1) * limit;
  // return delay({ requests: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** PATCH /api/finance/withdrawals/:id */
export async function updateWithdrawRequestStatus(id, { status, adminNote }) {
  // Real version: const { data } = await axiosClient.patch(`/finance/withdrawals/${id}`, { status, adminNote }); return data.request;
console.log(status);

 try {
    const { data } = await axiosClient.patch(`/finance/update/withdrawals/${id}`, { status, adminNote });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
  // withdrawRequests = withdrawRequests.map((r) =>
  //   r._id === id ? { ...r, status, adminNote: adminNote || "", processedAt: new Date().toISOString() } : r
  // );
  // return delay(withdrawRequests.find((r) => r._id === id));
}

/** GET /api/finance/transactions */
export async function getTransactions({ type, source, page = 1, limit = 12 } = {}) {
  // Real version: const { data } = await axiosClient.get("/finance/transactions", { params: {...} }); return data;

 try {
    const { data } = await axiosClient.get(`/finance/transactions`, {
      params: { type, source, page, limit },
    });

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data ========
  // let results = transactions;
  // if (type && type !== "all") results = results.filter((t) => t.type === type);
  // if (source && source !== "all") results = results.filter((t) => t.source === source);

  // results = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // const total = results.length;
  // const start = (page - 1) * limit;
  // return delay({ transactions: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}