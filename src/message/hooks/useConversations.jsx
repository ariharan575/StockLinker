import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchConversations } from "../api/chatApi";
import { mapConversationList } from "../utils/chatMappers";


export function useConversations({ keyword = "", includeArchived = false } = {}) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['conversations', keyword, includeArchived], [keyword, includeArchived]);

  // ✅ TANSTACK QUERY INTEGRATION
  const { 
    data: conversations = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await fetchConversations({ keyword, includeArchived });
      return mapConversationList(data);
    },
    staleTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
  });

  // Optimistically bump a conversation's preview + move it to top on new activity.
  const patchConversationPreview = useCallback((conversationId, { lastMsg, time, unreadDelta = 0 }) => {
    queryClient.setQueryData(queryKey, (prev = []) => {
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
  }, [queryClient, queryKey]);

  const clearUnread = useCallback((conversationId) => {
    queryClient.setQueryData(queryKey, (prev = []) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
    );
  }, [queryClient, queryKey]);

  const upsertConversation = useCallback((conversation) => {
    queryClient.setQueryData(queryKey, (prev = []) => {
      const idx = prev.findIndex((c) => c.id === conversation.id);
      if (idx === -1) return [conversation, ...prev];
      const next = [...prev];
      next[idx] = conversation;
      return next;
    });
  }, [queryClient, queryKey]);

  return {
    conversations,
    loading,
    error,
    refresh: refetch,
    patchConversationPreview,
    clearUnread,
    upsertConversation,
  };
}