const COLOR_CLASSES = [
  "from-indigo-500 to-indigo-600",
  "from-sky-500 to-sky-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-violet-500 to-violet-600",
  "from-cyan-500 to-cyan-600",
  "from-blue-500 to-blue-600",
];

function colorForId(id) {
  if (!id) return COLOR_CLASSES[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % COLOR_CLASSES.length;
  }
  return COLOR_CLASSES[Math.abs(hash)];
}

function formatTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function mapConversation(dto) {
  return {
    id: dto.id,
    name: dto.counterpartName || "Unknown",
    role: dto.counterpartBusinessName || "",
    colorClass: colorForId(dto.counterpartId),
    online: undefined,
    unread: dto.unreadCount || 0,
    lastMsg: dto.lastMessage || "",
    time: formatTime(dto.lastMessageAt),
    _counterpartId: dto.counterpartId,
    _blocked: dto.blocked,
    _archived: dto.archived,
  };
}

export function mapConversationList(listResponse) {
  return (listResponse.conversations || []).map(mapConversation);
}

export function mapMessage(dto) {
  return {
    id: dto.id,
    from: dto.mine ? "me" : "them",
    text: dto.message,
    time: formatTime(dto.createdAt || dto.sentAt),
    read: dto.status === "READ",
    _status: dto.status,
    _deleted: dto.deleted,
    _edited: dto.edited,
    _senderId: dto.senderId, // 🚀 ADDED: Required to prevent WebSocket echo bugs
  };
}

export function mapMessagePage(pagedResponse) {
  return [...(pagedResponse.messages || [])].reverse().map(mapMessage);
}