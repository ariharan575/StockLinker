import { useEffect, useRef } from "react";
import { connectSocket, releaseSocket } from "../api/socketClient";

export function useConversationSocket(conversationId, { onMessage, onStatus } = {}) {
  const subRef = useRef(null);
  
  // 🚀 THE FIX: Store callbacks in refs to avoid dependency cycle re-renders 
  // that were constantly disconnecting and dropping messages.
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

    if (client.connected) {
      subscribe();
    } else {
      // 🚀 THE FIX: Safely chain callbacks without overwriting the global listener!
      const originalOnConnect = client.onConnect;
      client.onConnect = (frame) => {
        if (originalOnConnect) originalOnConnect(frame);
        subscribe();
      };
    }

    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
        subRef.current = null;
      }
      releaseSocket();
    };
  }, [conversationId]);
}