import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://your-app.up.railway.app/api",
});

export const cmsApi = {
  // FAQs
  getAdminFAQs: (params) => API.get("/admin/faqs", { params }),
  createFAQ: (data) => API.post("/admin/faqs", data),
  updateFAQ: (id, data) => API.put(`/admin/faqs/${id}`, data),
  deleteFAQ: (id) => API.delete(`/admin/faqs/${id}`),

  // Terms & Conditions
  getAdminTerms: () => API.get("/admin/terms"),
  saveTerms: (data) => API.post("/admin/terms", data),
  deleteTerms: (id) => API.delete(`/admin/terms/${id}`),
};