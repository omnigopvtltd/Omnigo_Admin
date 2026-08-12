import { mockProducts, mockRestaurants } from "./mockData";
import { axiosClient } from "./axiosClient";

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTBmNTcwYWNhMDFkYThhZDE5YmY1MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzgzNjkwNjEwLCJleHAiOjE3ODQyOTU0MTB9.qFBxDutfTMQqVrqaPeOgaXCrohxWrPOgTZFceC8VbZU"
let products = [...mockProducts]; // in-memory store so admin CRUD feels real in the demo

function delay(data, ms = 450) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

function nextId() {
  return "p" + Math.random().toString(16).slice(2).padEnd(23, "0").slice(0, 23);
}

function attachRestaurant(product) {
  const restaurant =
    mockRestaurants.find((r) => r._id === (product.restaurantId?._id ?? product.restaurantId)) ?? null;
  return {
    ...product,
    restaurantId: restaurant
      ? { _id: restaurant._id, name: restaurant.name, logo: restaurant.logo, status: restaurant.status }
      : product.restaurantId,
  };
}

/** GET /api/products?restaurantId=&category=&status=&search=&page=&limit= */
export async function getProducts({ restaurantId, category, status, search, page = 1, limit = 12 } = {}) {
  // Real version:
  // const { data } = await axiosClient.get("/products", { params: { restaurantId, category, status, search, page, limit } });
  // return data;

  try {
    const { data } = await axiosClient.get("/products", { params: { restaurantId, category, status, search, page, limit }});
    
    console.log("API RESPONSE DATA:", data); // Check if data is coming
    return data;
    
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ========= mock data ================
  // let results = products;

  // if (restaurantId) {
  //   results = results.filter((p) => (p.restaurantId?._id ?? p.restaurantId) === restaurantId);
  // }
  // if (category) results = results.filter((p) => p.category === category);
  // if (status && status !== "all") results = results.filter((p) => p.status === status);
  // if (search) {
  //   const q = search.toLowerCase();
  //   results = results.filter(
  //     (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  //   );
  // }

  // const total = results.length;
  // const start = (page - 1) * limit;
  // const paged = results.slice(start, start + limit);

  // return delay({ products: paged, total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** GET /api/products/:id */
export async function getProductById(id) {
  // Real version: const { data } = await axiosClient.get(`/products/${id}`); return data.product;
  const product = products.find((p) => p._id === id);
  return delay(product ?? null);
}

/** POST /api/products */
export async function createProduct(payload) {
  // Real version: const { data } = await axiosClient.post("/products", payload); return data.product;

  try {
    const { data } = await axiosClient.post("/products/create", payload);
    
    console.log("API RESPONSE DATA:", data); // Check if data is coming
    return data;
    
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ==== mock data =====
  // const product = attachRestaurant({
  //   _id: nextId(),
  //   images: [],
  //   addOns: [],
  //   tags: [],
  //   rating: { average: 0, count: 0 },
  //   createdAt: new Date().toISOString(),
  //   ...payload,
  // });
  // products = [product, ...products];
  // return delay(product);
}

/** PUT /api/products/:id */
export async function updateProduct(id, payload) {
  // Real version: const { data } = await axiosClient.put(`/products/${id}`, payload); return data.product;

  try {
    const { data } = await axiosClient.put(`/products/update/${id}`, payload);
    
    console.log("API RESPONSE DATA:", data); // Check if data is coming
    return data;
    
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  // ====== mock data ======
  // products = products.map((p) => (p._id === id ? attachRestaurant({ ...p, ...payload }) : p));
  // return delay(products.find((p) => p._id === id));
}

/** PATCH /api/products/:id/availability */
export async function toggleAvailability(id, isAvailable) {
  // Real version: const { data } = await axiosClient.patch(`/products/${id}/availability`, { isAvailable }); return data.product;
  products = products.map((p) => (p._id === id ? { ...p, isAvailable } : p));
  return delay(products.find((p) => p._id === id));
}

/** DELETE /api/products/:id */
export async function deleteProduct(id) {
  // Real version: await axiosClient.delete(`/products/${id}`); return;

  try {
    const { data } = await axiosClient.delete(`/products/delete/${id}`);
    
    console.log("API RESPONSE DATA:", data); // Check if data is coming
    return data;
    
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
  // ===== mock data =========
  products = products.filter((p) => p._id !== id);
  return delay({ success: true });
}