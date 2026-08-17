import { axiosClient } from "./axiosClient";

export const zoneApi = {
  // Get all zones
  getZones: async () => {
    const response = await axiosClient.get("/auth/location/zones");
    return response.data;
  },

  // Get zone by ID
  getZoneById: async (id) => {
    const response = await axiosClient.get(`/auth/location/zone/${id}`);
    return response.data;
  },

  // Create new zone
  createZone: async (zoneData) => {
    console.log(zoneData);
    
    const response = await axiosClient.post("/auth/location/add-zone", zoneData);
    return response.data;
  },

  // Update existing zone
  updateZone: async ({ id, ...zoneData }) => {
    const response = await axiosClient.put(`/auth/location/zone/update/${id}`, zoneData);
    return response.data;
  },

  // Delete zone
  deleteZone: async (id) => {
    const response = await axiosClient.delete(`/auth/location/zone/delete/${id}`);
    return response.data;
  },

  // Toggle zone active status
  toggleZoneStatus: async ({ id, isActive }) => {
    const response = await axiosClient.patch(`/auth/location/zone/update/${id}/status`, { isActive });
    return response.data;
  },
};