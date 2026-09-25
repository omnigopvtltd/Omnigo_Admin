import { axiosClient } from "./axiosClient";

export async function getCoupons({
  search,
  isActive,
  type,
  page = 1,
  limit = 10,
} = {}) {
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
    throw error; 
  }
}

export async function createCoupon(payload) {
  
  try {
    const { data } = await axiosClient.post(`/coupons/create`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }
}


export async function updateCoupon(id, payload) {
  
  try {
    const { data } = await axiosClient.put(`/coupons/update/${id}`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }
}

export async function deleteCoupon(id) {
  try {
    const { data } = await axiosClient.delete(`/coupons/delete/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; 
  }
}
