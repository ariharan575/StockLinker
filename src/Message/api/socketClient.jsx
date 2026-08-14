import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export function connectSocket() {
  if (!client) {
    
    const backendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8080';
    const wsUrl = `${backendUri}/ws`;
    
    client = new Client({
      webSocketFactory: () =>
        new SockJS(wsUrl, null, { withCredentials: true }),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });
  }
  
  if (!client.active) {
    client.activate();
  }
  return client;
}

export function releaseSocket() {
  // REMOVED: We no longer deactivate the socket here!
  // This keeps the socket alive globally when you leave the Messenger page.
}

export function disconnectSocket() {
  // ONLY called by GlobalChatListener when the user logs out
  if (client && client.active) {
    client.deactivate();
    client = null;
  }
}