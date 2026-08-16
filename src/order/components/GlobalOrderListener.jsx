import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/context/AuthContext'; 
import { useWebSocket } from '../../hooks/useWebSocket';

export default function GlobalOrderListener({ onOrderEvent }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // ✅ GLOBAL BACKGROUND LISTENER FOR ORDERS
  useWebSocket(isAuthenticated && user?.id ? [
    {
      topic: `/topic/orders/${user.id}`,
      callback: (payload) => {
        try {
          const { orderId, status } = payload;
          const TABS = ["all", "PENDING", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
          
          // Generate timestamps based on the new status
          const now = new Date().toISOString();
          const timeUpdates = {};
          if (status === 'PROCESSING') timeUpdates.confirmedAt = now;
          if (status === 'OUT_FOR_DELIVERY') timeUpdates.outForDeliveryAt = now;
          if (status === 'DELIVERED') timeUpdates.deliveredAt = now;
          if (status === 'CANCELLED') timeUpdates.cancelledAt = now;

          // 1. INSTANTLY UPDATE ALL RELEVANT TABS IN BACKGROUND
          TABS.forEach(tab => {
            queryClient.setQueryData(['ordersList', tab], (oldData) => {
              if (!oldData || !Array.isArray(oldData.orders)) return oldData;
              
              if (tab === 'all' || tab === status) {
                const exists = oldData.orders.some(o => o.id === orderId);
                if (exists) {
                  return {
                    ...oldData,
                    orders: oldData.orders.map(o => o.id === orderId ? { ...o, status, ...timeUpdates } : o)
                  };
                }
                return oldData; 
              } else {
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
        } catch (e) {
          console.error("Failed to process global order websocket event", e);
        }
      }
    }
  ] : []);

  return null;
}