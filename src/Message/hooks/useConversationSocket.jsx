import { useEffect, useRef } from "react";
import { connectSocket, releaseSocket } from "../api/socketClient";

/**
 * Subscribes to /topic/conversation/{id} for the currently open conversation.
 * Two payload shapes arrive on the same topic:
 *  - full MessageResponse (new message, edit, delete) -> onMessage
 *  - MessageStatusEvent (delivered/read ticks)          -> onStatus
 * Distinguished by the presence of a "message" field, which only MessageResponse has.
 */
export function useConversationSocket(conversationId, { onMessage, onStatus } = {}) {
  const subRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const client = connectSocket();

    const subscribe = () => {
      subRef.current = client.subscribe(`/topic/conversation/${conversationId}`, (frame) => {
        const payload = JSON.parse(frame.body);
        if (payload.message !== undefined) {
          onMessage?.(payload);
        } else {
          onStatus?.(payload);
        }
      });
    };

    if (client.connected) {
      subscribe();
    } else {
      client.onConnect = subscribe;
    }

    return () => {
      subRef.current?.unsubscribe();
      releaseSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
}