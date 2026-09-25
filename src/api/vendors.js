import { axiosClient } from "./axiosClient";
// import { mockRestaurants } from "./mockData";

// let restaurants = [...mockRestaurants]; // in-memory store so admin CRUD feels real in the demo

function delay(data, ms = 450) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(data)), ms),
  );
}

function nextId() {
  return "r" + Math.random().toString(16).slice(2).padEnd(23, "0").slice(0, 23);
}

/** GET /api/vendors?status=&search=&cuisine=&page=&limit= */
export async function getVendors({
  status,
  search,
  page = 1,
  limit = 12,
} = {}) {
  // Real version:
  try {
    const { data } = await axiosClient.get("/vendors", {
      params: { status, search, page, limit },
    });
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

/** GET /api/vendors/:id */
export async function getVendorById(id) {
  try {
    const { data } = await axiosClient.get(`/vendors/${id}`);
    return data.vendors;
  } catch (error) {
    throw error;
  }
}

/** GET /api/vendors/vendor-menu/:id */
export async function getVendorMenuById(vendorId = id) {
  try {
    const { data } = await axiosClient.get(`/vendors/vendor-menu/${vendorId}`);
    return data.vendors;
  } catch (error) {
    throw error;
  }
}

/** POST /api/vendors */
// export async function createVendor(payload) {
//   try {
//     const { data } = await axiosClient.post("/vendors/signup", payload);
//     return data;
//   } catch (error) {
//     console.error(
//       "API CALL FAILED:",
//       error.response ? error.response.data : error.message,
//     );
//     throw error;
//   }
// }

/** PUT /api/vednors/:id */
export async function updateVendor(id, payload) {
  try {
    const { data } = await axiosClient.put(
      `/vendors/vendor-profile/update/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

/** PATCH /api/vendorss/:id/status */
export async function updateVendorStatus(id, status) {
  try {
    const { data } = await axiosClient.patch(
      `/vendors/update/${id}/status`, status);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

/** DELETE /api/vendors/:id */
export async function deleteVendor(id) {
  try {
    const { data } = await axiosClient.delete(`/vendors/delete/${id}`);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}
