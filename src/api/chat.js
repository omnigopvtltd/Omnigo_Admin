import { axiosClient } from "./axiosClient";

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

export async function getContacts(search = "") {
  const { data } = await axiosClient.get("/chat/contacts", {
    params: { search },
  });
  return data; 
}

export async function getMessages(conversationId) {
  if (!conversationId) return [];
  const { data } = await axiosClient.get(
    `/chat/conversations/${conversationId}/messages`,
  );
  return data.messages || data;
}


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

export async function sendMessage(
  conversationId,
  { text, attachments = [], senderRole = "admin", senderId = "6a7b574e5cf4c5a6bba1a982"},
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
    throw error; 
  }
}

export async function markConversationRead(conversationId, role = "admin") {
  const { data } = await axiosClient.patch(
    `/chat/conversations/${conversationId}/read`,
    { role },
  );
  return data;
}
