import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; 
import {
  Search, MoreVertical, Paperclip, Smile, Send, ArrowLeft, MessageSquare,
  Users, MessageCircle, X, UserPlus, Loader2, Sparkles, HelpCircle
} from "lucide-react";
import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { createOrGetConversation } from "../api/chatApi";
import { networkApi } from "../../auth/services/api"; 
import { MessageBubble } from "../components/MessageBubble";
import { PremiumToast } from "../../components/PremiumToast";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function Avatar({ name, colorClass, sizeClass = "w-10 h-10", textClass = "text-sm", online, showStatus = true }) {
  return (
    <div className="relative shrink-0 select-none">
      <div className={`${sizeClass} bg-gradient-to-br ${colorClass || "from-slate-700 to-black"} rounded-full flex items-center justify-center font-bold text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.2)] ring-1 ring-slate-900/5`}>
        <span className={`${textClass} tracking-tight`}>{getInitials(name)}</span>
      </div>
      {showStatus && online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${online ? "bg-[#17B26A]" : "bg-slate-300"}`} />
      )}
    </div>
  );
}

const ConversationSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl animate-pulse">
    <div className="w-11 h-11 bg-slate-200/80 rounded-full shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline gap-2 mb-2">
        <div className="h-4 bg-slate-200/80 rounded-md w-1/2" />
        <div className="h-3 bg-slate-100 rounded-md w-8" />
      </div>
      <div className="h-3 bg-slate-100 rounded-md w-3/4" />
    </div>
  </div>
);

const PartnerSkeleton = () => (
  <div className="flex items-center gap-3.5 p-3 rounded-xl animate-pulse">
    <div className="w-11 h-11 bg-slate-200/80 rounded-full shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-slate-200/80 rounded-md w-1/2 mb-1.5" />
      <div className="h-3 bg-slate-100 rounded-md w-1/3" />
    </div>
  </div>
);

function ConversationItem({ conv, isActive, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, backgroundColor: isActive ? "#ffffff" : "#F8FAFC" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200 select-none ${isActive ? "bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/80" : "bg-transparent border border-transparent hover:border-slate-100"}`}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-500 rounded-r-full shadow-[0_0_12px_rgba(236,72,153,0.4)]" />}
      <Avatar name={conv.name} colorClass={conv.colorClass} sizeClass="w-11 h-11" textClass="text-[13px]" online={conv.online} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2 mb-0.5">
          <h3 className={`font-['Manrope',_sans-serif] text-[15px] font-extrabold truncate tracking-tight leading-snug ${conv.unread > 0 && !isActive ? "text-black" : "text-slate-800"}`}>{conv.name}</h3>
          <span className={`text-[11px] font-bold shrink-0 ${isActive || conv.unread > 0 ? "text-pink-600" : "text-slate-400"}`}>{conv.time}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className={`text-[13px] truncate leading-relaxed ${conv.unread > 0 && !isActive ? "font-bold text-slate-800" : "font-medium text-slate-500"}`}>{conv.lastMsg}</p>
          {conv.unread > 0 && <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-extrabold rounded-full bg-pink-500 text-white shadow-sm shadow-pink-500/20">{conv.unread}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function ConversationList({ convs, activeId, onSelect, isMobileHidden, onOpenNewChat, isInitialLoad }) {
  const [query, setQuery] = useState("");
  const filtered = convs.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMsg.toLowerCase().includes(query.toLowerCase()) || (c.role && c.role.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className={`w-full lg:w-[380px] shrink-0 flex flex-col bg-white border-r border-slate-200 min-h-0 overflow-hidden relative z-20 transition-all duration-300 ease-in-out ${isMobileHidden ? "hidden lg:flex" : "flex"}`}>
      <div className="p-1 pt-4 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-4 px-3">
          <h2 className="font-['Manrope',_sans-serif] text-[24px] sm:text-[28px] font-extrabold text-black tracking-tight">Messages</h2>
          {convs.length > 0 && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onOpenNewChat} className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all shadow-sm">
              <MessageCircle className="w-3.5 h-3.5" /><span>New Chat</span>
            </motion.button>
          )}
        </div>
        {convs.length > 0 && (
          <div className="relative group px-3 pb-3">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 -mt-1.5"><Search className="w-4 h-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" /></div>
            <input type="text" placeholder="Search conversations..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white focus:ring-1 focus:ring-pink-500 rounded-xl text-[13px] font-medium text-black outline-none transition-all duration-200 placeholder:text-slate-400 shadow-sm" />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto bg-[#FAFAFA] py-2 no-scrollbar">
        {isInitialLoad ? (
          <div className="flex flex-col mt-2">
            {[1, 2, 3, 4, 5].map((i) => <ConversationSkeleton key={i} />)}
          </div>
        ) : convs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-100/50 animate-pulse" />
              <MessageSquare className="w-7 h-7 text-slate-300 relative z-10" />
            </div>
            <p className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-800">No active chats yet</p>
            <p className="text-[13px] text-slate-500 font-medium mt-2 max-w-[220px] mx-auto leading-relaxed">Connect and collaborate with your verified workspace partners.</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onOpenNewChat} className="mt-8 inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[13px] font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-95">
              <span>Start a New Chat</span>
            </motion.button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4"><Search className="w-6 h-6 text-slate-300" /></div>
            <p className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-800">No conversations found</p>
            <p className="text-[13px] text-slate-500 font-medium mt-1.5">Try adjusting your search terms.</p>
          </div>
        ) : (
          filtered.map((c) => <ConversationItem key={c.id} conv={c} isActive={c.id === activeId} onClick={() => onSelect(c.id)} />)
        )}
      </div>
    </div>
  );
}

function ChatHeader({ conv, onBack }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-3.5 bg-white border-b border-slate-200 shrink-0 select-none relative z-20 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onBack} className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-black hover:bg-slate-50 rounded-xl transition-all duration-200 shrink-0"><ArrowLeft className="w-5 h-5" /></button>
        <Avatar name={conv.name} colorClass={conv.colorClass} sizeClass="w-10 h-10" textClass="text-[13px]" online={conv.online} />
        <div className="min-w-0">
          <h2 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-black tracking-tight truncate leading-snug">{conv.name}</h2>
          <p className="text-[12px] text-slate-500 truncate leading-tight flex items-center gap-1.5 font-bold">{conv.online === true ? <span className="text-[#17B26A]">Online</span> : conv.role || "Offline"}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0"><motion.button whileTap={{ scale: 0.94 }} className="p-2.5 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl transition-all"><MoreVertical className="w-[18px] h-[18px]" /></motion.button></div>
    </div>
  );
}

function MessageList({ messages, conv, onRetry, onEdit, onDelete }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, 50);
  }, [messages]);

  const grouped = messages.map((msg, i) => ({
    ...msg, isGrouped: i > 0 && messages[i - 1].from === msg.from, isLast: i === messages.length - 1 || messages[i + 1].from !== msg.from,
  }));

  return (
    <div className="flex-1 overflow-y-auto py-4 bg-[#FAFAFA] relative z-10 flex flex-col no-scrollbar">
      <div className="flex flex-col mt-auto">
        <AnimatePresence initial={false}>
          {grouped.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              msg={msg} 
              conv={conv} 
              isGrouped={msg.isGrouped} 
              isLast={msg.isLast} 
              onRetry={onRetry} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </AnimatePresence>
      </div>
      <div ref={scrollRef} className="h-4 shrink-0" />
    </div>
  );
}

function MessageComposer({ onSend, activeId, isSending }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [activeId]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 relative z-20">
      <div className="px-3 flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-pink-500 focus-within:border-pink-500 shadow-sm">
        <textarea ref={textareaRef} value={value} onChange={(e) => { setValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }} onKeyDown={handleKeyDown} placeholder="Write a message..." rows={1} className="flex-1 max-h-28 min-h-[44px] bg-transparent resize-none outline-none py-2.5 px-2 text-[14px] font-medium text-black placeholder:text-slate-400 leading-relaxed self-center no-scrollbar" />
        <motion.button whileTap={value.trim() && !isSending ? { scale: 0.95 } : {}} onClick={handleSend} disabled={!value.trim() || isSending} className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all shrink-0 mb-0.5 ${value.trim() && !isSending ? "bg-black text-white hover:bg-slate-800 shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>{isSending ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <Send className="w-4 h-4 ml-0.5" />}</motion.button>
      </div>
    </div>
  );
}

function EmptyState({ onOpenNewChat }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50 relative z-10 select-none h-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
      <div className="relative mb-8 mt-[-5%]">
        <div className="w-28 h-28 bg-white border border-slate-100 shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-[32px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-pink-500/5 rounded-[32px] animate-pulse" />
          <MessageSquare className="w-10 h-10 text-slate-300 relative z-10" />
        </div>
        <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/20 ring-4 ring-white">
          <Users className="w-5 h-5 text-white" />
        </div>
      </div>
      <h3 className="font-['Manrope',_sans-serif] text-[24px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight mt-2 mb-3">Connect with partners</h3>
      <p className="text-[14px] sm:text-[15px] text-slate-500 text-center max-w-sm leading-relaxed mb-10 font-medium">Select a chat from the sidebar or start a new conversation with your connected buyers and sellers.</p>
      <motion.button 
        whileHover={{ scale: 1.02, y: -2 }} 
        whileTap={{ scale: 0.98 }} 
        onClick={onOpenNewChat} 
        className="flex items-center gap-2.5 bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-[14px] shadow-lg shadow-slate-200 transition-all duration-300 active:scale-95"
      >
        <Sparkles className="w-4 h-4 text-pink-400" />
        <span>Start a Conversation</span>
      </motion.button>
    </div>
  );
}

function NewChatModal({ isOpen, onClose, onSelectPartner }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: partners = [], isLoading: loading } = useQuery({
    queryKey: ['connectedPartnersModal'],
    queryFn: async () => {
      const res = await networkApi.getConnectedSuppliers();
      return (res.data?.data || res.data || []).map(p => ({
        id: p.userId || p.id,
        name: p.name || "Unknown Partner",
        businessName: p.businessName || p.category || "Verified Workspace",
        profileImage: p.profileImage || null
      }));
    },
    enabled: isOpen, 
    staleTime: 5 * 60 * 1000, 
  });

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 font-['Inter',_sans-serif]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 15 }} transition={{ type: "spring", duration: 0.4 }} className="relative bg-white w-full max-w-md rounded-[24px] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-pink-500" />
                <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[18px] text-black tracking-tight">New Conversation</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-black transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search active connections..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-[13px] font-medium outline-none transition-all shadow-sm" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 min-h-[250px] no-scrollbar">
              {loading ? (
                <div className="flex flex-col mt-2">
                  {[1, 2, 3, 4].map((i) => <PartnerSkeleton key={i} />)}
                </div>
              ) : filteredPartners.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <HelpCircle className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-800">No connections found</p>
                  <p className="text-[13px] text-slate-500 font-medium mt-1.5">No verified partners match your search.</p>
                </div>
              ) : (
                filteredPartners.map((partner) => (
                  <motion.div key={partner.id} whileHover={{ x: 2, backgroundColor: "#F8FAFC" }} onClick={() => onSelectPartner(partner)} className="flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <Avatar name={partner.name} colorClass="from-slate-700 to-black" sizeClass="w-11 h-11" textClass="text-[13px]" showStatus={false} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-black truncate leading-snug">{partner.name}</h4>
                      <p className="text-[12px] font-medium text-slate-500 truncate leading-normal mt-0.5">{partner.businessName}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Messenger() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeId, setActiveId] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [notification, setNotification] = useState(null);

  const { conversations, loading: convsLoading, error: convError, clearUnread, patchConversationPreview, refresh: refreshConversations } = useConversations();
  const activeConv = conversations.find((c) => c.id === activeId) || null;

  const { messages, sendMessage, editMsg, deleteMsg, retrySend, markRead, isSending } = useMessages(activeId, activeConv?._counterpartId, { 
    onSent: ({ lastMsg, time }) => patchConversationPreview(activeId, { lastMsg, time }) 
  });

  const selectConversation = useCallback((id) => {
    setActiveId(id);
    setMobileChatOpen(true);
    clearUnread(id);
  }, [clearUnread]);

  const handleSelectPartner = useCallback((partner) => {
    setIsModalOpen(false);
    createOrGetConversation({
      counterpartId: partner.id,
      counterpartName: partner.name,
      counterpartBusinessName: partner.businessName,
      counterpartProfileImage: partner.profileImage
    }).then((createdDto) => {
      refreshConversations().then(() => selectConversation(createdDto.id));
    }).catch((err) => {
      setNotification({ type: 'error', msg: err.response?.data?.message || "Failed to start conversation" });
    });
  }, [refreshConversations, selectConversation]);

  // ✅ SAFELY PROCESSES ROUTING FROM NOTIFICATIONS WITHOUT CREATING BOGUS CHATS
  useEffect(() => {
    if (!location.state) return;

    if (location.state.openChatWithReference) {
      if (convsLoading) return; // Wait for conversations to load
      
      const refId = location.state.openChatWithReference;
      const existingConv = conversations.find(c => c.id === refId || c._counterpartId === refId);
      
      if (existingConv) {
        selectConversation(existingConv.id);
      }
      navigate(location.pathname, { replace: true, state: {} });
    } 
    else if (location.state.partnerToMessage) {
      const partner = location.state.partnerToMessage;
      handleSelectPartner(partner);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, handleSelectPartner, conversations, convsLoading, selectConversation]);

  useEffect(() => {
    if (activeId) markRead();
  }, [activeId, markRead]);

  const handleEditMessage = async (msgId, newText) => {
    try {
      await editMsg(msgId, newText);
      setNotification({ type: 'success', msg: 'Message edited successfully.' });
    } catch (err) {
      setNotification({ type: 'error', msg: err.response?.data?.message || 'Failed to edit message.' });
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteMsg(msgId);
      setNotification({ type: 'success', msg: 'Message deleted successfully.' });
    } catch (err) {
      setNotification({ type: 'error', msg: err.response?.data?.message || 'Failed to delete message.' });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <PremiumToast 
        isVisible={!!notification} 
        type={notification?.type || 'info'} 
        message={notification?.msg} 
        onClose={() => setNotification(null)} 
      />

      <div className="w-full h-full 2xl:mx-[10px] gap-5 mb-8 my-3 lg:mb-0 flex overflow-hidden bg-white text-[#0F1626] font-['Inter',_sans-serif] antialiased relative">
        <div className="absolute inset-0 bg-[#FAFAFA] pointer-events-none z-0" />
        
        <ConversationList convs={conversations} activeId={activeId} onSelect={selectConversation} isMobileHidden={mobileChatOpen} onOpenNewChat={() => setIsModalOpen(true)} isInitialLoad={convsLoading} />
        
        <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10 bg-white ${!mobileChatOpen ? "hidden lg:flex" : "flex"}`}>
          {activeConv ? (
            <>
              <ChatHeader conv={activeConv} onBack={() => setMobileChatOpen(false)} />
              <MessageList 
                messages={messages} 
                conv={activeConv} 
                onRetry={retrySend} 
                onEdit={handleEditMessage} 
                onDelete={handleDeleteMessage} 
              />
              <MessageComposer activeId={activeId} onSend={sendMessage} isSending={isSending} />
            </>
          ) : <EmptyState onOpenNewChat={() => setIsModalOpen(true)} />}
        </div>
        <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectPartner={handleSelectPartner} />
      </div>
    </>
  );
}