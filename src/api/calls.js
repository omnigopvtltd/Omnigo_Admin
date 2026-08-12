import { mockCallLogs } from "./mockData";

// import { axiosClient } from "./axiosClient";

let calls = [...mockCallLogs];

function delay(data, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

function nextId() {
  return "call" + Math.random().toString(16).slice(2).padEnd(18, "0").slice(0, 18);
}

/** GET /api/calls?status=&page=&limit= */
export async function getCallLogs({ status, page = 1, limit = 20 } = {}) {
  // Real version: const { data } = await axiosClient.get("/calls", { params: {...} }); return data;
  let results = calls;
  if (status && status !== "all") results = results.filter((c) => c.status === status);

  const total = results.length;
  const start = (page - 1) * limit;
  return delay({ calls: results.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) || 1 });
}

/** POST /api/calls */
export async function initiateCall({ receiverId, receiverName, conversationId }) {
  // Real version: const { data } = await axiosClient.post("/calls", { receiverId, conversationId }); return data.call;
  const call = {
    _id: nextId(),
    conversationId: conversationId || null,
    callerId: { _id: "admin-001", name: "Admin User" },
    callerRole: "admin",
    receiverId: { _id: receiverId, name: receiverName },
    status: "ringing",
    startedAt: new Date().toISOString(),
    durationSeconds: 0,
  };
  calls = [call, ...calls];
  return delay(call, 200);
}

/** PATCH /api/calls/:id */
export async function updateCallStatus(callId, status, durationSeconds = 0) {
  // Real version: const { data } = await axiosClient.patch(`/calls/${callId}`, { status }); return data.call;
  calls = calls.map((c) => (c._id === callId ? { ...c, status, durationSeconds } : c));
  return delay(calls.find((c) => c._id === callId), 150);
}