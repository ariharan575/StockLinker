import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/context/AuthContext'; 
import { connectSocket, disconnectSocket, onSocketConnect } from '../api/socketClient'; 

export default function GlobalChatListener() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const client = connectSocket();
    let subscription = null;

    const subscribeToQueue = () => {
      if (subscription) return;
      
      subscription = client.subscribe('/user/queue/chat', (message) => {
        try {
          const payload = JSON.parse(message.body);
          
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

              // Prevent duplicate bubbles if the local socket also caught it
              if (prevMessages.some((m) => m.id === mappedMsg.id)) {
                return prevMessages;
              }
              
              return [...prevMessages, mappedMsg];
            });

            // 3. Update global unread count badge
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            
          } else {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
          }
        } catch (e) {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      });
    };

    const unsubscribeConnect = onSocketConnect(subscribeToQueue);

    return () => {
      unsubscribeConnect();
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    };
  }, [isAuthenticated, queryClient]);

  return null;
}