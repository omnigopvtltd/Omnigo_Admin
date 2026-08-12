import { axiosClient } from "./axiosClient";

export async function searchGlobal(query) {
  try {
    const { data } = await axiosClient.get(
      `/admin/search?q=${encodeURIComponent(query)}`
    );

    console.log("API RESPONSE DATA:", data.results);
    return data.results;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

export async function getNotifications() {
  try {
    const { data } = await axiosClient.get(`/admin/notifications`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

export async function markAllNotificationsRead() {
  try {
    const { data } = await axiosClient.patch(`/admin/update/notifications/read-all`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

export async function getAdminProfile(id) {
  console.log(id);
  
  try {
    const { data } = await axiosClient.get(`/admin/profile/${id}`);

    console.log("API RESPONSE DATA:", data.user);
    return data.user;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

export async function updateAdminProfile(payload, id) {
  try {
    console.log(id);
    
    const { data } = await axiosClient.put(`/admin/update/profile/${id}`, payload);

    console.log("API RESPONSE DATA:", data.user);
    return data.user;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}
