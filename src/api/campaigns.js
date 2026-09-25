import { axiosClient } from "./axiosClient";


export async function getCampaigns({ search, isActive, type, page = 1, limit = 10 } = {}) {
try {
    const { data } = await axiosClient.get(`/campaigns`, {
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


export async function createCampaign(payload) {
  try {
    const { data } = await axiosClient.post(`/campaigns/create`, payload);

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


export async function updateCampaign(id, payload) {
  try {
    const { data } = await axiosClient.put(`/campaigns/update/${id}`, payload);

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

export async function deleteCampaign(id) {

try {
    const { data } = await axiosClient.delete(`/campaigns/delete/${id}`);

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