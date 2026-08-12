import { axiosClient } from "./axiosClient";
import { mockRestaurants } from "./mockData";

// import { axiosClient } from "./axiosClient";

let restaurants = [...mockRestaurants]; // in-memory store so admin CRUD feels real in the demo

function delay(data, ms = 450) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(data)), ms),
  );
}

function nextId() {
  return "r" + Math.random().toString(16).slice(2).padEnd(23, "0").slice(0, 23);
}

/** GET /api/restaurants?status=&search=&cuisine=&page=&limit= */
export async function getRestaurants({
  status,
  search,
  cuisine,
  page = 1,
  limit = 12,
} = {}) {
  // Real version:
  try {
    const { data } = await axiosClient.get("/restaurants", {
      params: { status, search, cuisine, page, limit },
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

/** GET /api/restaurants/:id */
export async function getRestaurantById(id) {
  try {
    const { data } = await axiosClient.get(`/restaurants/${id}`);
    return data.restaurant;
  } catch (error) {
    throw error;
  }
}

/** POST /api/restaurants */
export async function createRestaurant(payload) {
  try {
    const { data } = await axiosClient.post("/restaurants/create", payload);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

/** PUT /api/restaurants/:id */
export async function updateRestaurant(id, payload) {
  try {
    const { data } = await axiosClient.put(
      `/restaurants/update/${id}`,
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

/** PATCH /api/restaurants/:id/status */
export async function updateRestaurantStatus(id, status) {
  try {
    const { data } = await axiosClient.patch(
      `/restaurants/update/${id}/status`,
      {
        status,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTBmNTcwYWNhMDFkYThhZDE5YmY1MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzgzNjkwNjEwLCJleHAiOjE3ODQyOTU0MTB9.qFBxDutfTMQqVrqaPeOgaXCrohxWrPOgTZFceC8VbZU",
        },
      },
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

/** DELETE /api/restaurants/:id */
export async function deleteRestaurant(id) {
  try {
    const { data } = await axiosClient.delete(`/restaurants/delete/${id}`);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}
