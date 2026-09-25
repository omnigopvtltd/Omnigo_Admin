import { axiosClient } from "./axiosClient";

// export const createMenu = async (menuData) => {
//   const { data } = await axiosClient("/restaurants/menu/create", menuData);
//   return data;
// };

// Fetch full menu by restaurant or home chef ID
export const getMenu = async (params) => {
    try {
    const { data } = await axiosClient.get("/restaurants/menu", { params });
    return data;
  } catch (error) {
    throw error;
  }
};

// // Toggle product stock/availability instantly
// export const toggleProductAvailability = async (productId) => {
//     try {
//     const { data } = await axiosClient.patch(`/restaurants/menu/product/${productId}/toggle-availability`);
//   return data;
//   } catch (error) {
//     throw error;
//   }
// };