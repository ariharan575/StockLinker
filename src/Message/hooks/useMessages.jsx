import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchMessages,
  sendMessage as apiSendMessage,
  markConversationRead,
  markMessageDelivered,
} from "../api/chatApi";
import { mapMessagePage, mapMessage } from "../utils/chatMappers";
import { useConversationSocket } from "./useConversationSocket";

export function useMessages(conversationId, counterpartId, { onSent } = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);
  
  // 🛡️ RATE LIMITER STATE
  const [isSending, setIsSending] = useState(false);

  const load = useCallback(() => {
    if (!conversationId) {
      setMessages([]);
      return Promise.resolve();
    }
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    return fetchMessages(conversationId)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setMessages(mapMessagePage(data));
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  const sendMessage = useCallback(
    async (text) => {
      if (!conversationId || isSending) return; // Drop spam clicks
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

      setMessages((prev) => [...prev, optimisticMsg]);
      onSent?.({ lastMsg: trimmed, time: optimisticMsg.time });

      try {
        const dto = await apiSendMessage({ conversationId, message: trimmed });
        const confirmed = mapMessage(dto);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? confirmed : m)));
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, _pending: false, _failed: true } : m))
        );
        setError(err);
      } finally {
        setIsSending(false); // Release Rate Limit Lock
      }
    },
    [conversationId, onSent, isSending]
  );

  const retrySend = useCallback(
    (failedMessage) => {
      setMessages((prev) => prev.filter((m) => m.id !== failedMessage.id));
      sendMessage(failedMessage.text);
    },
    [sendMessage]
  );

  const markRead = useCallback(() => {
    if (!conversationId) return;
    return markConversationRead(conversationId).catch(() => {});
  }, [conversationId]);

  const handleIncoming = useCallback((dto) => {
    if (counterpartId && dto.senderId && dto.senderId !== counterpartId) return; 

    const mapped = mapMessage(dto);
    mapped.from = "them"; 
    
    setMessages((prev) => {
      if (prev.some((m) => m.id === mapped.id)) {
        return prev.map((m) => (m.id === mapped.id ? mapped : m));
      }
      return [...prev, mapped]; 
    });
  }, [counterpartId]);

  const handleStatus = useCallback((event) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.from !== "me") return m;
        if (event.status === "READ") return { ...m, read: true, _status: "READ" };
        if (event.status === "DELIVERED" && m._status === "SENT") return { ...m, _status: "DELIVERED" };
        return m;
      })
    );
  }, []);

  useConversationSocket(conversationId, { onMessage: handleIncoming, onStatus: handleStatus });

  useEffect(() => {
    messages
      .filter((m) => m.from === "them" && m._status === "SENT" && !m._deleted)
      .forEach((m) => {
        markMessageDelivered(m.id).catch(() => {});
      });
  }, [messages]);

  return { messages, loading, error, sendMessage, retrySend, markRead, refresh: load, isSending };
}