import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/context/AuthContext'; 
import { useWebSocket } from '../../hooks/useWebSocket'; // ✅ Import the new hook

export default function GlobalChatListener() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // ✅ ONLY run the WebSocket listener if the user is authenticated
  useWebSocket(isAuthenticated ? [
    {
      topic: '/user/queue/chat',
      callback: (payload) => {
        try {
          if (payload && payload.message) {
            // 1. UPDATE SIDEBAR (Conversation List)
            queryClient.setQueryData(['conversations', "", false], (prev = []) => {
              const idx = prev.findIndex((c) => c.id === payload.conversationId);
              
              if (idx === -1) {
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
                return prev;
              }
              
              const updated = {
                ...prev[idx],
                lastMsg: payload.message,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                unread: prev[idx].unread + 1,
              };
              
              const next = [...prev];
              next.splice(idx, 1);
              next.unshift(updated);
              return next;
            });

            // 2. UPDATE OPEN MESSAGES IN BACKGROUND
            queryClient.setQueryData(['messages', payload.conversationId], (prevMessages) => {
              if (!prevMessages) return prevMessages;

              const mappedMsg = {
                id: payload.id,
                from: "them", 
                text: payload.message,
                time: new Date(payload.createdAt || payload.sentAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                read: false,
                _status: payload.status || "SENT",
                _deleted: payload.deleted || false,
                _edited: payload.edited || false,
                _senderId: payload.senderId,
              };

              // Prevent duplicate bubbles
              if (prevMessages.some((m) => m.id === mappedMsg.id)) {
                return prevMessages;
              }
              
              return [...prevMessages, mappedMsg];
            });

            // 3. Update global unread count badge
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            
          } else {
            // Read receipts / status updates
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
          }
        } catch (e) {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      }
    }
  ] : []);

  return null;
}