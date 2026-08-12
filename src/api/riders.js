// import { axiosClient } from "./axiosClient";

// function delay(data, ms = 450) {
//   return new Promise((resolve) =>
//     setTimeout(() => resolve(structuredClone(data)), ms),
//   );
// }

// function nextId() {
//   return "r" + Math.random().toString(16).slice(2).padEnd(23, "0").slice(0, 23);
// }

// /** GET /api/riders?status=&search=&page=&limit=12 */
// export async function getRiders({
//   status,
//   search,
//   page = 1,
//   limit = 12,
// } = {}) {
//   try {
//     const { data } = await axiosClient.get("/auth/riders", {
//       params: { status, search, page, limit },
//     });
//     console.log("API RESPONSE DATA:", data); // Check if data is coming
//     return data.riders;

//   } catch (error) {
//     console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
//     throw error;
//   }

//  }

// /** GET /api/riders/:id */
// // export async function getRiderById(id) {
// //  const rider = riders.find((r) => r._id === id);
// //   return delay(restaurant ?? null);
// // }

// /** POST /api/rider */
// export async function createRiders(payload) {
//     try {
//     const { data } = await axiosClient.post("/auth/rider", payload);
//     console.log("API RESPONSE DATA:", data); // Check if data is coming
//     return data;

//   } catch (error) {
//     console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// /** PUT /api/riders/update/:id */
// export async function updateRider(id, payload) {
//     try {

//         console.log("API RESPONSE DATA:", id, payload);
//     const { data } = await axiosClient.put(`/auth/riders/update/${id}`, payload);
//     console.log("API RESPONSE DATA:", data.riders);
//     return data.riders;

//   } catch (error) {
//     console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// /** PATCH /api/riders/update/:id/status */
// export async function updateRiderStatus(id, isBlocked) { try {
//     const { data } = await axiosClient.patch(`/auth/riders/update/${id}/status`, {
//       isBlocked,
//     });
//     console.log(isBlocked);
//     console.log("API RESPONSE DATA:", data);
//     return data.riders;

//   } catch (error) {
//     console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// /** DELETE /api/riders/delete/:id */
// export async function deleteRider(id) {
//   try {
//     const { data } = await axiosClient.delete(`/auth/riders/delete/${id}`);
//     console.log("API RESPONSE DATA:", data); // Check if data is coming
//     return data;

//   } catch (error) {
//     console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

import { mockRidersFull, mockRiderTransactions } from "./mockData";
import { axiosClient } from "./axiosClient";

let riders = [...mockRidersFull];
let transactions = [...mockRiderTransactions];

function delay(data, ms = 400) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(data)), ms),
  );
}

function nextId() {
  return (
    "rd" + Math.random().toString(16).slice(2).padEnd(22, "0").slice(0, 22)
  );
}

function findRider(id) {
  return riders.find((r) => r._id === id);
}

function creditDebit(rider, type, amount, reason, source) {
  const balance = rider.wallet.balance;
  const newBalance = type === "credit" ? balance + amount : balance - amount;
  rider.wallet = { balance: newBalance };

  const tx = {
    _id: "rtx" + Math.random().toString(16).slice(2, 12),
    userId: rider._id,
    riderName: rider.name,
    type,
    amount,
    reason,
    balanceAfter: newBalance,
    source,
    createdAt: new Date().toISOString(),
  };
  transactions = [tx, ...transactions];
  return tx;
}

// ---------------- CRUD ----------------

/** GET /api/riders */
export async function getRiders({
  search,
  isBlocked,
  cnicStatus,
  faceStatus,
  page = 1,
  limit = 8,
} = {}) {
  // Real version: const { data } = await axiosClient.get("/riders", { params: {...} }); return data;

  try {
    const { data } = await axiosClient.get(`/auth/riders`, {
      params: { search, isBlocked, cnicStatus, faceStatus, page, limit },
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

  // ======= mock data ========
  //   let results = riders;
  //   if (search) {
  //     const q = search.toLowerCase();
  //     results = results.filter((r) => r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.email.toLowerCase().includes(q));
  //   }
  //   if (isBlocked !== undefined) results = results.filter((r) => r.isBlocked === isBlocked);
  //   if (cnicStatus) results = results.filter((r) => r.riderProfile.cnicVerification.status === cnicStatus);
  //   if (faceStatus) results = results.filter((r) => r.riderProfile.faceVerification.status === faceStatus);

  //   const total = results.length;
  //   const start = (page - 1) * limit;
  //   return delay({ riders: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** GET /api/riders/:id */
export async function getRiderById(id) {
  // Real version: const { data } = await axiosClient.get(`/riders/${id}`); return data;

  try {
    const { data } = await axiosClient.get(`/riders/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ====== mock data ========
  //   const rider = findRider(id);
  //   return delay({
  //     rider,
  //     currentOrders: [],
  //     deliveryHistory: [],
  //     sessionHistory: [],
  //   });
}

/** POST /api/riders */
export async function createRider(payload) {
  // Real version: const { data } = await axiosClient.post("/riders", payload); return data.rider;

  try {
    const { data } = await axiosClient.post(`/riders/create`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ====== mock data =========
  //   const rider = {
  //     _id: nextId(),
  //     role: "rider",
  //     isBlocked: false,
  //     wallet: { balance: 0 },
  //     activeOrders: 0,
  //     deliveredCount: 0,
  //     createdAt: new Date().toISOString(),
  //     riderProfile: {
  //       vehicleType: payload.vehicleType || "bike",
  //       vehiclePlate: payload.vehiclePlate || "",
  //       vehicleModel: payload.vehicleModel || "",
  //       isOnline: false,
  //       rating: { average: 0, count: 0 },
  //       cnicVerification: {
  //         status: "not_submitted",
  //         cnicNumber: "",
  //         frontImage: "",
  //         backImage: "",
  //       },
  //       faceVerification: { status: "not_submitted", image: "" },
  //     },
  //     name: payload.name,
  //     email: payload.email,
  //     phone: payload.phone,
  //   };
  //   riders = [rider, ...riders];
  //   return delay(rider);
}

/** PUT /api/riders/:id */
export async function updateRider(id, payload) {
  // Real version: const { data } = await axiosClient.put(`/riders/${id}`, payload); return data.rider;

  try {
    const { data } = await axiosClient.put(`/riders/update/${id}`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ======== mock data =========
  //   riders = riders.map((r) =>
  //     r._id === id
  //       ? {
  //           ...r,
  //           name: payload.name ?? r.name,
  //           phone: payload.phone ?? r.phone,
  //           riderProfile: {
  //             ...r.riderProfile,
  //             ...(payload.vehicleType && { vehicleType: payload.vehicleType }),
  //             ...(payload.vehiclePlate !== undefined && {
  //               vehiclePlate: payload.vehiclePlate,
  //             }),
  //             ...(payload.vehicleModel !== undefined && {
  //               vehicleModel: payload.vehicleModel,
  //             }),
  //           },
  //         }
  //       : r,
  //   );
  //   return delay(findRider(id));
}

/** PATCH /api/riders/:id/block */
export async function updateRiderBlockStatus(id, isBlocked) {
  // Real version: const { data } = await axiosClient.patch(`/riders/${id}/block`, { isBlocked }); return data.rider;

  try {
    const { data } = await axiosClient.patch(`/riders/update/${id}/block`, {
      isBlocked,
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

  // ========== mock data ==========
  //   riders = riders.map((r) => (r._id === id ? { ...r, isBlocked } : r));
  //   return delay(findRider(id));
}

/** DELETE /api/riders/:id */
export async function deleteRider(id) {
  // Real version: await axiosClient.delete(`/riders/${id}`); return;

  try {
    const { data } = await axiosClient.delete(`/riders/delete/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ========= mcok data =========
  //   riders = riders.filter((r) => r._id !== id);
  //   return delay({ success: true });
}

// ---------------- Verification ----------------

/** PATCH /api/riders/verification/:id/cnic */
export async function reviewCnicVerification(id, { status, rejectionReason }) {
  // Real version: const { data } = await axiosClient.patch(`/riders/verification/${id}/cnic`, { status, rejectionReason }); return data;

  try {
    const { data } = await axiosClient.patch(
      `/riders/verification/${id}/cnic`,
      { status, rejectionReason },
    );

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  //  ======= mock data ==========
  //   riders = riders.map((r) =>
  //     r._id === id
  //       ? {
  //           ...r,
  //           riderProfile: {
  //             ...r.riderProfile,
  //             cnicVerification: {
  //               ...r.riderProfile.cnicVerification,
  //               status,
  //               rejectionReason: rejectionReason || "",
  //             },
  //           },
  //         }
  //       : r,
  //   );
  //   return delay(findRider(id));
}

/** PATCH /api/riders/verification/:id/face */
export async function reviewFaceVerification(id, { status, rejectionReason }) {
  // Real version: const { data } = await axiosClient.patch(`/riders/verification/${id}/face`, { status, rejectionReason }); return data;

  try {
    const { data } = await axiosClient.patch(
      `/riders/verification/${id}/face`,
      { status, rejectionReason },
    );

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ====== mock data ========
  //   riders = riders.map((r) =>
  //     r._id === id
  //       ? {
  //           ...r,
  //           riderProfile: {
  //             ...r.riderProfile,
  //             faceVerification: {
  //               ...r.riderProfile.faceVerification,
  //               status,
  //               rejectionReason: rejectionReason || "",
  //             },
  //           },
  //         }
  //       : r,
  //   );
  //   return delay(findRider(id));
}

// ---------------- Wallet ----------------

/** GET /api/riders/wallet/:id */
export async function getRiderWallet(id) {
  // Real version: const { data } = await axiosClient.get(`/riders/wallet/${id}`); return data;

  try {
    const { data } = await axiosClient.get(`/riders/wallet/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ========= mock data =========
  //   const rider = findRider(id);
  //   const txs = transactions
  //     .filter((t) => t.userId === id)
  //     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //   return delay({
  //     balance: rider?.wallet.balance ?? 0,
  //     transactions: txs.slice(0, 30),
  //   });
}

/** POST /api/riders/wallet/:id/adjust */
export async function adjustRiderWallet(id, { type, amount, reason }) {
  // Real version: const { data } = await axiosClient.post(`/riders/wallet/${id}/adjust`, { type, amount, reason }); return data;

  try {
    const { data } = await axiosClient.post(`/riders/wallet/${id}/adjust`, {
      type,
      amount,
      reason,
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

  // ===== mock data ======
  //   const rider = findRider(id);
  //   if (!rider) throw new Error("Rider not found");
  //   if (type === "debit" && amount > rider.wallet.balance)
  //     throw new Error("Insufficient wallet balance");

  //   const tx = creditDebit(
  //     rider,
  //     type,
  //     Number(amount),
  //     reason || (type === "credit" ? "Manual credit" : "Manual debit"),
  //     "manual",
  //   );
  //   riders = riders.map((r) => (r._id === id ? rider : r));
  //   return delay({ balance: rider.wallet.balance, transaction: tx });
}
