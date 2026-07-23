import { useState, useEffect, useCallback, useRef } from "react";
import { fetchConversations } from "../api/chatApi";
import { mapConversationList } from "../utils/chatMappers";

/**
 * Owns the conversation list: loading/error/empty states, refresh, and
 * local optimistic patching so the sidebar preview updates instantly on send
 * without waiting for a full refetch.
 */
export function useConversations({ keyword = "", includeArchived = false } = {}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const load = useCallback(() => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    return fetchConversations({ keyword, includeArchived })
      .then((data) => {
        if (requestId !== requestIdRef.current) return; // stale response, ignore
        setConversations(mapConversationList(data));
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [keyword, includeArchived]);

  useEffect(() => {
    load();
  }, [load]);

  // Optimistically bump a conversation's preview + move it to top on new activity.
  const patchConversationPreview = useCallback((conversationId, { lastMsg, time, unreadDelta = 0 }) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conversationId);
      if (idx === -1) return prev;
      const updated = {
        ...prev[idx],
        lastMsg: lastMsg ?? prev[idx].lastMsg,
        time: time ?? prev[idx].time,
        unread: Math.max(0, prev[idx].unread + unreadDelta),
      };
      const next = [...prev];
      next.splice(idx, 1);
      next.unshift(updated);
      return next;
    });
  }, []);

  const clearUnread = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
    );
  }, []);

  const upsertConversation = useCallback((conversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conversation.id);
      if (idx === -1) return [conversation, ...prev];
      const next = [...prev];
      next[idx] = conversation;
      return next;
    });
  }, []);

  return {
    conversations,
    loading,
    error,
    refresh: load,
    patchConversationPreview,
    clearUnread,
    upsertConversation,
  };
}