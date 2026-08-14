import { axiosInstance } from "../../Authentication/api/axiosInstance";


// ─── Conversations ──────────────────────────────────────────

export function createOrGetConversation({ counterpartId, counterpartName, counterpartBusinessName, counterpartProfileImage }) {
  return axiosInstance
    .post("/chat/conversations", {
      counterpartId,
      counterpartName,
      counterpartBusinessName,
      counterpartProfileImage,
    })
    .then((res) => res.data);
}

export function fetchConversations({ keyword, includeArchived = false, page = 0, size = 20 } = {}) {
  return axiosInstance
    .get("/chat/conversations", {
      params: { keyword, includeArchived, page, size },
    })
    .then((res) => res.data);
}

export function fetchConversationById(id) {
  return axiosInstance.get(`/chat/conversations/${id}`).then((res) => res.data);
}

// ─── Messages ───────────────────────────────────────────────

export function fetchMessages(conversationId, { page = 0, size = 30 } = {}) {
  return axiosInstance
    .get(`/chat/messages/${conversationId}`, { params: { page, size } })
    .then((res) => res.data);
}

export function sendMessage({ conversationId, message }) {
  return axiosInstance
    .post("/chat/messages", { conversationId, message })
    .then((res) => res.data);
}

export function markConversationRead(conversationId, messageId) {
  return axiosInstance
    .put(`/chat/messages/read/${conversationId}`, messageId ? { messageId } : {})
    .then((res) => res.data);
}

export function markMessageDelivered(messageId) {
  return axiosInstance.put(`/chat/messages/delivered/${messageId}`).then((res) => res.data);
}

export function editMessage(messageId, message) {
  return axiosInstance
    .put(`/chat/messages/edit/${messageId}`, { message })
    .then((res) => res.data);
}

export function deleteMessage(messageId) {
  return axiosInstance.delete(`/chat/messages/${messageId}`);
}

export function fetchUnreadCount() {
  return axiosInstance.get("/chat/unread").then((res) => res.data);
}