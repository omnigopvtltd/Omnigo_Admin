import { mockCoupons } from "./mockData";

import { axiosClient } from "./axiosClient";

let coupons = [...mockCoupons];

function delay(data, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

function nextId() {
  return "c" + Math.random().toString(16).slice(2).padEnd(23, "0").slice(0, 23);
}

/** GET /api/coupons?search=&isActive=&type= */
export async function getCoupons({ search, isActive, type, page = 1, limit = 10 } = {}) {
  // Real version: const { data } = await axiosClient.get("/coupons", { params: {...} }); return data;
  
  try {
    const { data } = await axiosClient.get(`/coupons`, {
      params: { search, isActive, type, page, limit },
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
  // let results = coupons;
  // if (search) results = results.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));
  // if (isActive !== undefined) results = results.filter((c) => c.isActive === isActive);
  // if (type && type !== "all") results = results.filter((c) => c.type === type);

  // const total = results.length;
  // const start = (page - 1) * limit;
  // return delay({ coupons: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** POST /api/coupons */
export async function createCoupon(payload) {
  // Real version: const { data } = await axiosClient.post("/coupons", payload); return data.coupon;
  
  try {
    const { data } = await axiosClient.post(`/coupons/create`, payload);

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
  // const coupon = { _id: nextId(), usedCount: 0, createdAt: new Date().toISOString(), ...payload };
  // coupons = [coupon, ...coupons];
  // return delay(coupon);
}

/** PUT /api/coupons/:id */
export async function updateCoupon(id, payload) {
  // Real version: const { data } = await axiosClient.put(`/coupons/${id}`, payload); return data.coupon;
  
  try {
    const { data } = await axiosClient.put(`/coupons/update/${id}`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // coupons = coupons.map((c) => (c._id === id ? { ...c, ...payload } : c));
  // return delay(coupons.find((c) => c._id === id));
}

/** DELETE /api/coupons/:id */
export async function deleteCoupon(id) {
  // Real version: await axiosClient.delete(`/coupons/${id}`); return;

  try {
    const { data } = await axiosClient.delete(`/coupons/delete/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // coupons = coupons.filter((c) => c._id !== id);
  // return delay({ success: true });
}