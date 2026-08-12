import { mockRiderSessions, mockSessionParticipations } from "./mockData";

// import { axiosClient } from "./axiosClient";

let sessions = [...mockRiderSessions];
let participations = [...mockSessionParticipations];

function delay(data, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

function nextId(prefix) {
  return prefix + Math.random().toString(16).slice(2).padEnd(20, "0").slice(0, 20);
}

/** GET /api/riders/sessions */
export async function getSessions({ isActive, page = 1, limit = 10 } = {}) {
  // Real version: const { data } = await axiosClient.get("/riders/sessions", { params: {...} }); return data;
  let results = sessions;
  if (isActive !== undefined) results = results.filter((s) => s.isActive === isActive);
  const total = results.length;
  const start = (page - 1) * limit;
  return delay({ sessions: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** POST /api/riders/sessions */
export async function createSession(payload) {
  // Real version: const { data } = await axiosClient.post("/riders/sessions", payload); return data.session;
  const session = { _id: nextId("session"), createdAt: new Date().toISOString(), ...payload };
  sessions = [session, ...sessions];
  return delay(session);
}

/** PUT /api/riders/sessions/:id */
export async function updateSession(id, payload) {
  // Real version: const { data } = await axiosClient.put(`/riders/sessions/${id}`, payload); return data.session;
  sessions = sessions.map((s) => (s._id === id ? { ...s, ...payload } : s));
  return delay(sessions.find((s) => s._id === id));
}

/** DELETE /api/riders/sessions/:id */
export async function deleteSession(id) {
  // Real version: await axiosClient.delete(`/riders/sessions/${id}`); return;
  const hasActive = participations.some((p) => p.sessionId._id === id && p.status === "in_progress");
  if (hasActive) throw new Error("Can't delete a session with riders currently in progress");
  sessions = sessions.filter((s) => s._id !== id);
  return delay({ success: true });
}

/** GET /api/riders/sessions/:id/participants */
export async function getSessionParticipants(id, { status } = {}) {
  // Real version: const { data } = await axiosClient.get(`/riders/sessions/${id}/participants`, { params: { status } }); return data.participants;
  let results = participations.filter((p) => p.sessionId._id === id);
  if (status && status !== "all") results = results.filter((p) => p.status === status);
  return delay(results);
}