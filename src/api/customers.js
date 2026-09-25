
import { axiosClient } from "./axiosClient";

export async function getCustomers({ status, search } = {}) {
  const { data } = await axiosClient.get("/auth/users", {
    params: { status, search }
  });
  return data.users; 
}

export async function updateCustomerStatus(id, isBlocked) {
  try {
    const { data } = await axiosClient.patch(`/auth/users/update/${id}/status`, {
      isBlocked, // Send 'isBlocked' matching what the backend expects
    });
    return data;
  } catch (error) {
    throw error;
  }
}