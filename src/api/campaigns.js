import { mockCampaigns } from "./mockData";

import { axiosClient } from "./axiosClient";

let campaigns = [...mockCampaigns];

function delay(data, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

function nextId() {
  return "cm" + Math.random().toString(16).slice(2).padEnd(22, "0").slice(0, 22);
}

/** GET /api/campaigns?search=&isActive=&type= */
export async function getCampaigns({ search, isActive, type, page = 1, limit = 10 } = {}) {
  // Real version: const { data } = await axiosClient.get("/campaigns", { params: {...} }); return data;

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
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
// ===== mock data 
  //   let results = campaigns;
//   if (search) results = results.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
//   if (isActive !== undefined) results = results.filter((c) => c.isActive === isActive);
//   if (type && type !== "all") results = results.filter((c) => c.type === type);

//   const total = results.length;
//   const start = (page - 1) * limit;
//   return delay({ campaigns: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** POST /api/campaigns */
export async function createCampaign(payload) {
  // Real version: const { data } = await axiosClient.post("/campaigns", payload); return data.campaign;

  try {
    const { data } = await axiosClient.post(`/campaigns/create`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  //   const campaign = { _id: nextId(), createdAt: new Date().toISOString(), ...payload };
//   campaigns = [campaign, ...campaigns];
//   return delay(campaign);
}

/** PUT /api/campaigns/:id */
export async function updateCampaign(id, payload) {
  // Real version: const { data } = await axiosClient.put(`/campaigns/${id}`, payload); return data.campaign;

  try {
    const { data } = await axiosClient.put(`/campaigns/update/${id}`, payload);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

  //   campaigns = campaigns.map((c) => (c._id === id ? { ...c, ...payload } : c));
//   return delay(campaigns.find((c) => c._id === id));
}

/** DELETE /api/campaigns/:id */
export async function deleteCampaign(id) {
  // Real version: await axiosClient.delete(`/campaigns/${id}`); return;

try {
    const { data } = await axiosClient.delete(`/campaigns/delete/${id}`);

    console.log("API RESPONSE DATA:", data);
    return data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }

//   campaigns = campaigns.filter((c) => c._id !== id);
//   return delay({ success: true });
}