import { axiosClient } from "./axiosClient";

/**
 * GET /api/chat/conversations
 */
export async function getConversations({
  type,
  search,
  page = 1,
  limit = 50,
} = {}) {
  const { data } = await axiosClient.get("/chat/conversations", {
    params: { type: type !== "all" ? type : undefined, search, page, limit },
  });
  return data;
}

/**
 * GET /api/chat/contacts (New endpoint)
 * Fetches directory of all registered customers, riders, and restaurants
 */
export async function getContacts(search = "") {
  const { data } = await axiosClient.get("/chat/contacts", {
    params: { search },
  });
  return data; // Expected shape: { customers: [], riders: [], restaurants: [] }
}

/**
 * GET /api/chat/conversations/:id/messages
 */
export async function getMessages(conversationId) {
  if (!conversationId) return [];
  const { data } = await axiosClient.get(
    `/chat/conversations/${conversationId}/messages`,
  );
  return data.messages || data;
}

/**
 * POST /api/chat/conversations
 * Gets existing thread or creates a new one
 */
export async function getOrCreateConversation({
  type,
  customerId,
  riderId,
  adminId,
  senderRole,
  text,
  // restaurantId,
}) {
  const { data } = await axiosClient.post("/chat/conversations", {
    type,
    customerId,
    riderId,
    adminId,
    senderRole,
    text,
    // restaurantId,
  });
  return data.conversation || data;
}

/**
 * POST /api/chat/conversations/:id/messages
 */
export async function sendMessage(
  conversationId,
  { text, attachments = [], senderRole = "admin", senderId },
) {
  console.log(text, attachments, senderRole, senderId);
  try {
    const { data } = await axiosClient.post(
      `/chat/conversations/${conversationId}/messages`,
      { text, attachments, senderRole, senderId },
    );
    return data.message || data;
  } catch (error) {
    console.error(
      "API CALL FAILED:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Tan-Query (useQuery) ko error batana zaroori hai
  }
}

/**
 * PATCH /api/chat/conversations/:id/read
 */
export async function markConversationRead(conversationId, role = "admin") {
  const { data } = await axiosClient.patch(
    `/chat/conversations/${conversationId}/read`,
    { role },
  );
  return data;
}
