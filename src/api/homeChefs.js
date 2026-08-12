import { axiosClient } from "./axiosClient";
// import { mockhomeChef } from "./mockData";

// import { axiosClient } from "./axiosClient";

// let homeChef = [...mockhomeChef]; // in-memory store so admin CRUD feels real in the demo

function delay(data, ms = 450) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(data)), ms),
  );
}

function nextId() {
  return "r" + Math.random().toString(16).slice(2).padEnd(23, "0").slice(0, 23);
}

/** GET /api/homeChefs?status=&search=&cuisine=&page=&limit= */
export async function getHomeChefs({
  status,
  search,
  cuisine,
  page = 1,
  limit = 12,
} = {}) {
  // Real version:
  try {
    const { data } = await axiosClient.get("/homeChefs", {
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

/** GET /api/homeChefs/:id */
export async function getHomeChefById(id) {
  try {
    const { data } = await axiosClient.get(`/homeChefs/${id}`);
    return data.homeChefs;
  } catch (error) {
    throw error;
  }
}

/** POST /api/homeChefs */
export async function createHomeChef(payload) {
  try {
    const { data } = await axiosClient.post("/homeChefs/create", payload);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

/** PUT /api/homeChef/:id */
export async function updateHomeChef(id, payload) {
  try {
    const { data } = await axiosClient.put(
      `/homeChefs/update/${id}`,
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

/** PATCH /api/homeChef/:id/status */
export async function updateHomeChefStatus(id, status) {
  try {
    const { data } = await axiosClient.patch(
      `/homeChefs/update/${id}/status`,
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

/** DELETE /api/homeChef/:id */
export async function deleteHomeChef(id) {
  try {
    const { data } = await axiosClient.delete(`/homeChefs/delete/${id}`);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}
