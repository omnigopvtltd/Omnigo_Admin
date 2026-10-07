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
  // Safely return array or object wrapped data
  return data.contacts || data.users || data || [];
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
  userId,
  riderId,
  adminId,
  vendorId,
  orderId,
  senderRole,
  text,
}) {
  console.log(type,
  userId,
  riderId,
  adminId,
  vendorId,
  orderId,
  senderRole,
  text)
  try {
    const body = {};
  if (type) body.type = type;
  if (userId) body.userId = userId;
  if (riderId) body.riderId = riderId;
  if (adminId) body.adminId = adminId;
  if (vendorId) body.vendorId = vendorId;
  if (orderId) body.orderId = orderId;
  if (senderRole) body.senderRole = senderRole;
  if (text) body.text = text;

  const { data } = await axiosClient.post("/chat/conversations", body)
    // const { data } = await axiosClient.post("/chat/conversations", {
    //   type,
    //   userId,
    //   riderId,
    //   adminId,
    //   vendorId,
    //   orderId,
    //   senderRole,
    //   text,
    // });
    console.log(data)
    return data.conversation || data;
  } catch (error) {
    console.error("API CALL FAILED:", error.response ? error.response.data : error.message);

    throw error;
    
  }
}

export async function sendMessage(
  conversationId,
  {
    text,
    attachments = [],
    senderRole = "admin",
    senderId,
    receiverId,
    receiverRole = "user",
  },
) {
  try {
    const { data } = await axiosClient.post(
      `/chat/conversations/${conversationId}/messages`,
      { text, attachments, senderRole, senderId, receiverId, receiverRole },
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