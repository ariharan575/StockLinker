import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { authApi } from '../services/api'; // Ensure this path matches your api.js location

// GLOBAL VARIABLES: Shared across all components
let sharedClient = null;
let isConnecting = false;
let globalSubscriptions = new Map(); // Tracks who is listening to what

export function useWebSocket(componentSubscriptions = []) {
  // We use a ref to track this specific component's subscriptions so we can clean them up
  const localSubsRef = useRef([]);

  useEffect(() => {
    let mounted = true;

    const connectAndSubscribe = async () => {
      // 1. IF NOT CONNECTED YET: Fetch ticket and establish the single global connection
      if (!sharedClient && !isConnecting) {
        isConnecting = true;
        try {
          const res = await authApi.getWsTicket();
          const token = res.data.ticket;

          const backendUri = import.meta.env.VITE_BACKEND_URI || 'https://stocklinker.onrender.com';
          
          sharedClient = new Client({
            webSocketFactory: () => new SockJS(`${backendUri}/ws`),
            connectHeaders: { Authorization: token },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
              console.log("Global WebSocket Connected securely!");
              isConnecting = false;
              
              // Apply any subscriptions that were waiting for the connection
              globalSubscriptions.forEach((callback, topic) => {
                sharedClient.subscribe(topic, (msg) => callback(JSON.parse(msg.body)));
              });
            },
            onStompError: (frame) => {
              console.error('Broker reported error: ' + frame.headers['message']);
              isConnecting = false;
            },
          });

          sharedClient.activate();
        } catch (error) {
          console.error("Failed to fetch WS ticket", error);
          isConnecting = false;
        }
      }

      // 2. REGISTER SUBSCRIPTIONS FOR THIS SPECIFIC COMPONENT
      componentSubscriptions.forEach(({ topic, callback }) => {
        globalSubscriptions.set(topic, callback); // Add to global map
        localSubsRef.current.push(topic); // Track locally for cleanup

        // If already connected, subscribe immediately
        if (sharedClient && sharedClient.connected) {
          sharedClient.subscribe(topic, (msg) => callback(JSON.parse(msg.body)));
        }
      });
    };

    connectAndSubscribe();

    // 3. CLEANUP: When the component unmounts (e.g., user leaves the page)
    return () => {
      mounted = false;
      // Remove only this component's subscriptions
      localSubsRef.current.forEach((topic) => {
        globalSubscriptions.delete(topic);
        if (sharedClient && sharedClient.connected) {
          sharedClient.unsubscribe(topic);
        }
      });
    };
  }, []); // Run once on mount

  return { client: sharedClient };
}