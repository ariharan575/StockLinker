import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;
let connectCallbacks = []; 

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
      onConnect: (frame) => {
        
        connectCallbacks.forEach((cb) => cb(frame));
      },
    });
  }
  
  if (!client.active) {
    client.activate();
  }
  return client;
}

export function onSocketConnect(callback) {
  if (client && client.connected) {
    callback();
  }
  connectCallbacks.push(callback);
  
  return () => {
    connectCallbacks = connectCallbacks.filter((cb) => cb !== callback);
  };
}

export function releaseSocket() {
  // Keeps the socket alive globally when you leave the Messenger page.
}

export function disconnectSocket() {
  // ONLY called by GlobalChatListener when the user logs out
  if (client && client.active) {
    client.deactivate();
    client = null;
    connectCallbacks = []; // clear listeners on logout
  }
}