import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/context/AuthContext'; 
import { connectSocket, disconnectSocket } from '../api/socketClient'; 

export default function GlobalOrderListener({ onOrderEvent }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const client = connectSocket();
    let subscription = null;

    const subscribeToOrders = () => {
      subscription = client.subscribe(`/topic/orders/${user.id}`, (message) => {
        try {
          if (message.body) {
            const payload = JSON.parse(message.body);
            const { orderId, status } = payload;

            const TABS = ["all", "PENDING", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
            
            // Generate timestamps based on the new status
            const now = new Date().toISOString();
            const timeUpdates = {};
            if (status === 'PROCESSING') timeUpdates.confirmedAt = now;
            if (status === 'OUT_FOR_DELIVERY') timeUpdates.outForDeliveryAt = now;
            if (status === 'DELIVERED') timeUpdates.deliveredAt = now;
            if (status === 'CANCELLED') timeUpdates.cancelledAt = now;

            // 1. INSTANTLY UPDATE ALL RELEVANT TABS
            TABS.forEach(tab => {
              queryClient.setQueryData(['ordersList', tab], (oldData) => {
                if (!oldData || !Array.isArray(oldData.orders)) return oldData;
                
                // If it's the "all" tab or the "matching status" tab, we UPDATE or ADD the order
                if (tab === 'all' || tab === status) {
                  const exists = oldData.orders.some(o => o.id === orderId);
                  if (exists) {
                    return {
                      ...oldData,
                      orders: oldData.orders.map(o => o.id === orderId ? { ...o, status, ...timeUpdates } : o)
                    };
                  }
                  // If it doesn't exist but belongs here (less common, handled by refetch fallback)
                  return oldData; 
                } 
                
                // If it's a DIFFERENT tab (e.g., it was PENDING, but is now PROCESSING), REMOVE IT from the old tab
                else {
                  return {
                    ...oldData,
                    orders: oldData.orders.filter(o => o.id !== orderId)
                  };
                }
              });
            });

            // 2. INSTANTLY UPDATE LIVE ROUTE TRACKER CACHE
            queryClient.setQueriesData({ queryKey: ['liveRoute'] }, (oldRoute) => {
              if (!Array.isArray(oldRoute)) return oldRoute;
              return oldRoute.map((stop) => {
                if (stop.id === orderId) {
                  return {
                    ...stop,
                    status: status,
                    isPast: status === 'DELIVERED',
                    isActive: status === 'OUT_FOR_DELIVERY',
                    isPending: status === 'PROCESSING'
                  };
                }
                return stop;
              });
            });

            // 3. TRIGGER GLOBAL TOAST NOTIFICATION
            if (onOrderEvent) {
              const formattedStatus = status ? status.replace(/_/g, ' ') : 'Updated';
              onOrderEvent(`Order status changed to ${formattedStatus}`);
            }
          }
        } catch (e) {
          console.error("Failed to process global order websocket event", e);
        }
      });
    };

    if (client.connected) {
      subscribeToOrders();
    } else {
      const originalOnConnect = client.onConnect;
      client.onConnect = (frame) => {
        if (originalOnConnect) originalOnConnect(frame);
        subscribeToOrders();
      };
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isAuthenticated, user?.id, queryClient, onOrderEvent]);

  return null;
}