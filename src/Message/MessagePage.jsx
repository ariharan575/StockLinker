import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  Search, MoreVertical, Paperclip, Smile, Send, ArrowLeft, MessageSquare,
  Users, MessageCircle, X, UserPlus, Loader2, Sparkles, HelpCircle
} from "lucide-react";
import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { createOrGetConversation } from "../api/chatApi";
import { networkApi } from "../../Authentication/services/api"; 

// --- ADDED PREMIUM COMPONENTS IMPORTS ---
import { PremiumToast } from "./components/component/PremiumToast";
import { DataFetchError } from "./components/component/DataFetchError";

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
        {isInitialLoad ? <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400"><Loader2 className="w-6 h-6 animate-spin text-black" /></div>
        : convs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-200/40"><MessageSquare className="w-6 h-6 text-slate-400" /></div>
            <p className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-black">No active chats yet</p>
            <p className="text-[13px] text-slate-500 font-medium mt-1.5 max-w-[200px] mx-auto leading-normal">Connect and collaborate with your verified workspace partners.</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onOpenNewChat} className="mt-6 inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[13px] font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all active:scale-95"><span>Start a New Chat</span></motion.button>
            </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center"><div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3"><Search className="w-5 h-5 text-slate-400" /></div><p className="font-['Manrope',_sans-serif] text-[15px] font-extrabold text-black">No conversations found</p></div>
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

function MessageBubble({ msg, conv, isGrouped, isLast, onRetry }) {
  const isMe = msg.from === "me";
  return (
    <motion.div initial={{ opacity: 0, y: 6, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.18, ease: "easeOut" }} className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 sm:px-6 ${isGrouped ? "mt-0.5" : "mt-4"}`}>
      <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
        <div className={`relative px-4 py-2.5 text-[14px] leading-relaxed break-words shadow-sm ${isMe ? "bg-slate-700 text-white rounded-[20px] rounded-tr-sm" : "bg-slate-100 text-slate-900 rounded-[20px] rounded-tl-sm border border-slate-200/60"} ${msg._failed ? "ring-1 ring-rose-400 bg-rose-50 text-rose-900" : ""} ${msg._pending ? "opacity-60" : ""}`}>
          {msg._deleted ? <span className="italic text-[13px] opacity-70 select-none">This message was deleted</span> : <span className="whitespace-pre-wrap font-medium">{msg.text}</span>}
        </div>
        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-slate-400 font-bold tracking-wide">{msg.time}</span>
          {isMe && isLast && !msg._failed && <span className="text-pink-500 font-extrabold text-[10px] select-none uppercase tracking-widest">{msg._pending ? "•" : msg.read ? "Read" : "Sent"}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function MessageList({ messages, conv, onRetry }) {
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
        <AnimatePresence initial={false}>{grouped.map((msg) => <MessageBubble key={msg.id} msg={msg} conv={conv} isGrouped={msg.isGrouped} isLast={msg.isLast} onRetry={onRetry} />)}</AnimatePresence>
      </div>
      <div ref={scrollRef} className="h-4 shrink-0" />
    </div>
  );
}

function MessageComposer({ onSend, activeId, isSending }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // 🚀 DEEP LINK FIX: Micro-delay to focus securely
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAFAFA] relative z-10 select-none">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-white border border-slate-200 shadow-sm rounded-3xl flex items-center justify-center relative"><div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 to-white rounded-3xl" /><MessageSquare className="w-9 h-9 text-slate-300 relative z-10" /></div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-xl flex items-center justify-center shadow-md shadow-black/20"><Users className="w-4 h-4 text-white" /></div>
      </div>
      <h3 className="font-['Manrope',_sans-serif] text-[22px] font-extrabold text-black tracking-tight mt-2 mb-2">Connect with partners</h3>
      <p className="text-[14px] text-slate-500 text-center max-w-sm leading-relaxed mb-8 font-medium">Select a chat from the sidebar or start a new conversation with your connected buyers and sellers.</p>
      <motion.button whileHover={{ scale: 1.02, y: -0.5 }} whileTap={{ scale: 0.98 }} onClick={onOpenNewChat} className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-[13px] shadow-md transition-all duration-200 active:scale-95"><Sparkles className="w-4 h-4 text-pink-400" /><span>Start a Conversation</span></motion.button>
    </div>
  );
}

function NewChatModal({ isOpen, onClose, onSelectPartner, onNotify }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // --- ADDED STATE FOR DATA FETCH ERROR ---
  const [fetchError, setFetchError] = useState(false);

  const fetchPartners = () => {
    setLoading(true);
    setFetchError(false);
    networkApi.getConnectedSuppliers()
      .then((res) => {
        const normalized = (res.data?.data || res.data || []).map(p => ({
          id: p.userId || p.id,
          name: p.name || "Unknown Partner",
          businessName: p.businessName || p.category || "Verified Workspace",
          profileImage: p.profileImage || null
        }));
        setPartners(normalized);
      })
      .catch((err) => {
        console.error(err);
        setFetchError(true);
        if (onNotify) onNotify('error', 'Failed to load connections.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchPartners();
  }, [isOpen]);

  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.businessName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 font-['Inter',_sans-serif]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 15 }} transition={{ type: "spring", duration: 0.4 }} className="relative bg-white w-full max-w-md rounded-[24px] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0"><div className="flex items-center gap-2.5"><UserPlus className="w-5 h-5 text-pink-500" /><h3 className="font-['Manrope',_sans-serif] font-extrabold text-[18px] text-black tracking-tight">New Conversation</h3></div><button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-black transition-colors"><X className="w-4 h-4" /></button></div>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0"><div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search active connections..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-[13px] font-medium outline-none transition-all shadow-sm" /></div></div>
            <div className="flex-1 overflow-y-auto p-2 min-h-[250px] no-scrollbar">
              {fetchError ? (
                <div className="scale-75 origin-top -mt-8">
                  <DataFetchError onRetry={fetchPartners} errorTitle="Network Error" errorMessage="Failed to load connections." />
                </div>
              ) : loading ? <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400"><Loader2 className="w-6 h-6 animate-spin text-black" /><span className="text-[12px] font-bold tracking-wide">Loading network...</span></div>
              : filteredPartners.length === 0 ? <div className="flex flex-col items-center justify-center h-48 text-center px-6"><HelpCircle className="w-8 h-8 text-slate-300 mb-3" /><p className="font-['Manrope',_sans-serif] text-[15px] font-extrabold text-black">No connections found</p></div>
              : filteredPartners.map((partner) => (
                <motion.div key={partner.id} whileHover={{ x: 2, backgroundColor: "#F8FAFC" }} onClick={() => onSelectPartner(partner)} className="flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                  <Avatar name={partner.name} colorClass="from-slate-700 to-black" sizeClass="w-11 h-11" textClass="text-[13px]" showStatus={false} />
                  <div className="flex-1 min-w-0"><h4 className="text-[14px] font-bold text-black truncate leading-snug">{partner.name}</h4><p className="text-[12px] font-medium text-slate-500 truncate leading-normal mt-0.5">{partner.businessName}</p></div>
                </motion.div>
              ))}
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

  // --- ADDED STATE FOR PREMIUM TOAST ---
  const [notification, setNotification] = useState(null);
  const showNotification = useCallback((type, msg) => {
    setNotification({ type, msg });
  }, []);

  const { conversations, loading: convsLoading, clearUnread, patchConversationPreview, refresh: refreshConversations } = useConversations();
  const activeConv = conversations.find((c) => c.id === activeId) || null;

  const { messages, sendMessage, retrySend, markRead, isSending } = useMessages(activeId, activeConv?._counterpartId, { 
    onSent: ({ lastMsg, time }) => patchConversationPreview(activeId, { lastMsg, time }) 
  });

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, { withCredentials: true }),
      onConnect: () => { client.subscribe('/user/queue/chat', () => { refreshConversations(); }); }
    });
    client.activate();
    return () => client.deactivate();
  }, [refreshConversations]);

  function selectConversation(id) {
    setActiveId(id);
    setMobileChatOpen(true);
    clearUnread(id);
  }

  const handleSelectPartner = useCallback((partner) => {
    setIsModalOpen(false);
    createOrGetConversation({
      counterpartId: partner.id,
      counterpartName: partner.name,
      counterpartBusinessName: partner.businessName,
      counterpartProfileImage: partner.profileImage
    }).then((createdDto) => {
      showNotification('success', `Chat started with ${partner.name}`);
      refreshConversations().then(() => selectConversation(createdDto.id));
    }).catch((err) => {
      console.error("Failed to generate system conversation tunnel:", err);
      showNotification('error', 'Failed to start conversation.');
    });
  }, [refreshConversations, showNotification]);

  useEffect(() => {
    if (location.state?.partnerToMessage) {
      const partner = location.state.partnerToMessage;
      handleSelectPartner(partner);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, handleSelectPartner]);

  useEffect(() => {
    if (activeId) markRead();
  }, [activeId]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* --- REPLACED OLD NOTIFICATION WITH PREMIUM TOAST --- */}
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
              <MessageList messages={messages} conv={activeConv} onRetry={retrySend} />
              <MessageComposer activeId={activeId} onSend={sendMessage} isSending={isSending} />
            </>
          ) : <EmptyState onOpenNewChat={() => setIsModalOpen(true)} />}
        </div>
        <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectPartner={handleSelectPartner} onNotify={showNotification} />
      </div>
    </>
  );
}