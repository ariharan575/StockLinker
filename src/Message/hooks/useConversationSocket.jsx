import { useEffect, useRef } from "react";
import { connectSocket, releaseSocket, onSocketConnect } from "../api/socketClient";

export function useConversationSocket(conversationId, { onMessage, onStatus } = {}) {
  const subRef = useRef(null);
  
  // Store callbacks in refs to avoid dependency cycle re-renders
  const callbacksRef = useRef({ onMessage, onStatus });

  useEffect(() => {
    callbacksRef.current = { onMessage, onStatus };
  }, [onMessage, onStatus]);

  useEffect(() => {
    if (!conversationId) return;

    const client = connectSocket();

    const subscribe = () => {
      if (subRef.current) return; // Prevent duplicate overlapping subscriptions
      
      subRef.current = client.subscribe(`/topic/conversation/${conversationId}`, (frame) => {
        const payload = JSON.parse(frame.body);
        if (payload.message !== undefined) {
          callbacksRef.current.onMessage?.(payload);
        } else {
          callbacksRef.current.onStatus?.(payload);
        }
      });
    };

    // 🚀 THE FIX: Subscribe using the new safe connection bus
    const unsubscribeConnect = onSocketConnect(subscribe);

    return () => {
      unsubscribeConnect(); // Remove listener when unmounting
      if (subRef.current) {
        subRef.current.unsubscribe();
        subRef.current = null;
      }
      releaseSocket();
    };
  }, [conversationId]);
}