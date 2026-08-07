import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  sendMessage as apiSendMessage,
  markConversationRead,
  markMessageDelivered,
  editMessage as apiEditMessage,
  deleteMessage as apiDeleteMessage
} from "../api/chatApi";
import { mapMessagePage, mapMessage } from "../utils/chatMappers";
import { useConversationSocket } from "./useConversationSocket";

export function useMessages(conversationId, counterpartId, { onSent } = {}) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['messages', conversationId], [conversationId]);

  const { 
    data: messages = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!conversationId) return [];
      const data = await fetchMessages(conversationId);
      return mapMessagePage(data);
    },
    enabled: !!conversationId, 
    staleTime: 5 * 60 * 1000,
  });
  
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async (text) => {
      if (!conversationId || isSending) return; 
      const trimmed = text.trim();
      if (!trimmed) return;

      setIsSending(true);

      const tempId = `temp-${Date.now()}`;
      const optimisticMsg = {
        id: tempId,
        from: "me",
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
        _status: "SENT",
        _pending: true,
      };

      queryClient.setQueryData(queryKey, (prev = []) => [...prev, optimisticMsg]);
      onSent?.({ lastMsg: trimmed, time: optimisticMsg.time });

      try {
        const dto = await apiSendMessage({ conversationId, message: trimmed });
        const confirmed = mapMessage(dto);
        queryClient.setQueryData(queryKey, (prev = []) => 
          prev.map((m) => (m.id === tempId ? confirmed : m))
        );
      } catch (err) {
        queryClient.setQueryData(queryKey, (prev = []) =>
          prev.map((m) => (m.id === tempId ? { ...m, _pending: false, _failed: true } : m))
        );
      } finally {
        setIsSending(false); 
      }
    },
    [conversationId, isSending, onSent, queryClient, queryKey]
  );

  const editMsg = useCallback(async (messageId, newText) => {
    try {
      // Optimistic update
      queryClient.setQueryData(queryKey, (prev = []) =>
        prev.map((m) => m.id === messageId ? { ...m, text: newText, _edited: true } : m)
      );
      await apiEditMessage(messageId, newText);
    } catch (err) {
      refetch(); // Rollback if failed
      throw err;
    }
  }, [queryClient, queryKey, refetch]);

  const deleteMsg = useCallback(async (messageId) => {
    try {
      // Optimistic update
      queryClient.setQueryData(queryKey, (prev = []) =>
        prev.map((m) => m.id === messageId ? { ...m, _deleted: true, text: "This message was deleted" } : m)
      );
      await apiDeleteMessage(messageId);
    } catch (err) {
      refetch(); // Rollback if failed
      throw err;
    }
  }, [queryClient, queryKey, refetch]);

  const retrySend = useCallback(
    (failedMessage) => {
      queryClient.setQueryData(queryKey, (prev = []) => prev.filter((m) => m.id !== failedMessage.id));
      sendMessage(failedMessage.text);
    },
    [sendMessage, queryClient, queryKey]
  );

  const markRead = useCallback(() => {
    if (!conversationId) return;
    return markConversationRead(conversationId).catch(() => {});
  }, [conversationId]);

  const handleIncoming = useCallback((dto) => {
    if (counterpartId && dto.senderId && dto.senderId !== counterpartId) return; 

    const mapped = mapMessage(dto);
    mapped.from = "them"; 
    
    queryClient.setQueryData(queryKey, (prev = []) => {
      if (prev.some((m) => m.id === mapped.id)) {
        return prev.map((m) => (m.id === mapped.id ? mapped : m));
      }
      return [...prev, mapped]; 
    });
  }, [counterpartId, queryClient, queryKey]);

  const handleStatus = useCallback((event) => {
    queryClient.setQueryData(queryKey, (prev = []) =>
      prev.map((m) => {
        if (m.from !== "me") return m;
        if (event.status === "READ") return { ...m, read: true, _status: "READ" };
        if (event.status === "DELIVERED" && m._status === "SENT") return { ...m, _status: "DELIVERED" };
        return m;
      })
    );
  }, [queryClient, queryKey]);

  useConversationSocket(conversationId, { onMessage: handleIncoming, onStatus: handleStatus });

  useEffect(() => {
    messages
      .filter((m) => m.from === "them" && m._status === "SENT" && !m._deleted)
      .forEach((m) => {
        markMessageDelivered(m.id).catch(() => {});
      });
  }, [messages]);

  return { messages, loading, error, sendMessage, editMsg, deleteMsg, retrySend, markRead, refresh: refetch, isSending };
}