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
  // Intentionally left blank!
  // We do NOT deactivate the socket here anymore.
  // This is the magic that keeps the socket alive globally when leaving a page.
}

export function disconnectSocket() {

  if (client && client.active) {
    client.deactivate();
    client = null;
  }
}