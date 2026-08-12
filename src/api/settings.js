import { axiosClient } from "./axiosClient";

export async function getSettings() {
  const { data } = await axiosClient.get("/settings");
  return data.settings;
}

export async function updateSettings(settingsData) {
  const { data } = await axiosClient.put("/settings", settingsData);
  return data.settings;
}