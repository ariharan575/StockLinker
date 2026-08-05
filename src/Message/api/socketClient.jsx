import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Single shared STOMP client for the app. Auth rides on the accessToken
 * HttpOnly cookie during the SockJS handshake — identical trust boundary
 * to the REST axios instance, no token ever touches JS.
 */
let client = null;
let refCount = 0;

function createClient() {
  return new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws", null, { withCredentials: true }),
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
}

export function connectSocket() {
  if (!client) client = createClient();
  refCount += 1;
  if (!client.active) client.activate();
  return client;
}

export function releaseSocket() {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && client?.active) {
    client.deactivate();
    client = null;
  }
}