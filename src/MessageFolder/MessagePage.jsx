import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Check,
  CheckCheck,
  ArrowLeft,
  MessageSquare,
  Users,
  Phone,
  Video,
  Pin,
  AtSign,
} from "lucide-react";

// ─── MOCK DATA ───────────────────────────────────────────────
const CONVERSATIONS = [
  {
    id: 1,
    name: "Nicky Franceska",
    role: "Product Designer",
    colorClass: "from-indigo-500 to-indigo-600",
    online: true,
    unread: 3,
    lastMsg: "That sounds good, but what exactly do you mean?",
    time: "11:48",
  },
  {
    id: 2,
    name: "Carry Jenkingson",
    role: "Engineering Lead",
    colorClass: "from-sky-500 to-sky-600",
    online: true,
    unread: 0,
    lastMsg: "If the rumors prove true Brooklyn...",
    time: "10:32",
  },
  {
    id: 3,
    name: "Alexey Vishnevskiy",
    role: "Backend Engineer",
    colorClass: "from-emerald-500 to-emerald-600",
    online: false,
    unread: 0,
    lastMsg: "Can't try to go on that concert, it was...",
    time: "12:45",
  },
  {
    id: 4,
    name: "Kelly Minori",
    role: "UX Researcher",
    colorClass: "from-amber-500 to-amber-600",
    online: true,
    unread: 0,
    lastMsg: "Yeah, that's the vibe.",
    time: "07:24",
  },
  {
    id: 5,
    name: "Bella Frederick",
    role: "Marketing",
    colorClass: "from-rose-500 to-rose-600",
    online: false,
    unread: 8,
    lastMsg: "Love the recipe that you gave me...",
    time: "05:47",
  },
  {
    id: 6,
    name: "Alan Dupree",
    role: "Sales",
    colorClass: "from-violet-500 to-violet-600",
    online: true,
    unread: 0,
    lastMsg: "Seems good to me, let's do that.",
    time: "05:21",
  },
  {
    id: 7,
    name: "Erick Conseil",
    role: "DevOps",
    colorClass: "from-cyan-500 to-cyan-600",
    online: false,
    unread: 0,
    lastMsg: "Boss nightmare — Grits...",
    time: "03:18",
  },
  {
    id: 8,
    name: "Sarah Jenkins",
    role: "Product Manager",
    colorClass: "from-blue-500 to-blue-600",
    online: true,
    unread: 0,
    lastMsg: "Let's review the quarterly roadmap.",
    time: "07:24",
  },
];

const MESSAGES_BY_CONV = {
  1: [
    { id: 1, from: "them", text: "That is such a sad story :( Don't even know what to say...", time: "10:44", read: true },
    { id: 2, from: "them", text: "Keep your heads up!", time: "10:46", read: true },
    { id: 3, from: "me", text: "Yeah, indeed that is, but what can you actually do about that? Pretty much nothing...", time: "11:16", read: true },
    { id: 4, from: "them", text: "Don't know, there is always a way to make this right, even if that's not obvious :)", time: "11:48", read: true },
    { id: 5, from: "them", text: "What if we're gonna change a bit of this and a bit of that, add some extra space and make some small changes and improvements?", time: "11:14", read: true },
    { id: 6, from: "me", text: "Hmm. Can't focus...", time: "11:48", read: true },
    { id: 7, from: "me", text: "That sounds good, but what exactly do you mean with that random text?", time: "11:48", read: false },
    { id: 8, from: "them", text: "Take your time 🙂", time: "11:45", read: true },
  ],
  default: [
    { id: 1, from: "them", text: "Hey there! 👋", time: "09:00", read: true },
    { id: 2, from: "me", text: "Hi! How's it going?", time: "09:01", read: true },
  ],
};

// ─── UTILS ──────────────────────────────────────────────────
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── COMPONENTS ─────────────────────────────────────────────

function Avatar({ name, colorClass, sizeClass = "w-10 h-10", textClass = "text-sm", online, showStatus = true }) {
  return (
    <div className="relative shrink-0">
      <div 
        className={`
          ${sizeClass} 
          bg-gradient-to-br ${colorClass} 
          rounded-full 
          flex items-center justify-center 
          font-medium text-white 
          shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.25)] 
          ring-1 ring-white/10
          transition-all duration-200
        `}
      >
        <span className={`${textClass} tracking-tight`}>{getInitials(name)}</span>
      </div>
      {showStatus && online !== undefined && (
        <span 
          className={`
            absolute bottom-0 right-0 
            w-3 h-3 rounded-full 
            border-2 border-white 
            shadow-sm
            ${online ? "bg-teal-500" : "bg-[#E5E7EB]"}
            transition-all duration-200
          `} 
        />
      )}
    </div>
  );
}

function ConversationItem({ conv, isActive, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-xl cursor-pointer 
        transition-all duration-200 
        ${isActive 
          ? "bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-[#E5E7EB] ring-inset" 
          : "hover:bg-[#F8FAFC] active:bg-[#F1F5F9]"
        }
      `}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.3)]" />
      )}
      
      <Avatar 
        name={conv.name} 
        colorClass={conv.colorClass} 
        sizeClass="w-11 h-11" 
        textClass="text-[13px]" 
        online={conv.online} 
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2 mb-0.5">
          <h3 className={`
            text-[14px] font-semibold truncate tracking-tight leading-snug
            ${isActive ? "text-[#111827]" : "text-[#111827]"}
            ${conv.unread > 0 && !isActive ? "text-[#111827]" : ""}
          `}>
            {conv.name}
          </h3>
          <span className={`
            text-[11px] font-medium shrink-0
            ${isActive ? "text-teal-600" : (conv.unread > 0 ? "text-teal-600" : "text-[#94A3B8]")}
          `}>
            {conv.time}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className={`
            text-[13px] truncate leading-relaxed
            ${isActive ? "text-[#64748B]" : "text-[#64748B]"}
            ${conv.unread > 0 && !isActive ? "font-medium text-[#111827]" : ""}
          `}>
            {conv.lastMsg}
          </p>
          {conv.unread > 0 && (
            <span className={`
              flex items-center justify-center h-5 min-w-[20px] px-1.5 
              text-[10px] font-semibold rounded-full 
              shadow-sm
              ${isActive ? "bg-teal-600 text-white" : "bg-teal-600 text-white"}
            `}>
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ConversationList({ convs, activeId, onSelect, isMobileHidden }) {
  const [query, setQuery] = useState("");
  const filtered = convs.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMsg.toLowerCase().includes(query.toLowerCase()) ||
      c.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`
      w-full lg:w-[380px] shrink-0 flex flex-col 
      bg-white border-r border-[#E5E7EB] 
      h-full overflow-hidden 
      transition-all duration-300 ease-in-out
      ${isMobileHidden ? "hidden lg:flex" : "flex"}
    `}>
      {/* Header */}
      <div className="px-5 pt-2 pb-4 border-b border-[#E5E7EB] shrink-0 bg-white">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#111827] tracking-tight">Messages</h2>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#94A3B8] group-focus-within:text-teal-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2.5 
              bg-[#F8FAFC] 
              border border-transparent 
              focus:border-teal-500/30 focus:bg-white 
              focus:ring-4 focus:ring-teal-500/10 
              rounded-xl 
              text-[14px] outline-none 
              transition-all duration-200 
              placeholder:text-[#94A3B8] 
              text-[#111827]
              font-medium
            "
          />
        </div>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#E5E7EB] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:transition-colors">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-12 h-12 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-[#94A3B8]" />
            </div>
            <p className="text-[14px] font-medium text-[#64748B]">No conversations found</p>
            <p className="text-[13px] text-[#94A3B8] mt-1">Try adjusting your search</p>
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c.id}
              conv={c}
              isActive={c.id === activeId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ChatHeader({ conv, onBack }) {
  return (
    <div className="py-3.5 flex items-center justify-between px-5 sm:px-6 bg-white border-b border-[#E5E7EB] shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onBack} 
          className="lg:hidden p-2 -ml-2 text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <Avatar 
          name={conv.name} 
          colorClass={conv.colorClass} 
          sizeClass="w-11 h-11" 
          textClass="text-[14px]" 
          online={conv.online} 
        />
        
        <div className="flex flex-col min-w-0">
          <h2 className="text-[16px] font-semibold text-[#111827] tracking-tight leading-snug truncate">
            {conv.name}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium text-[#64748B] truncate">
              {conv.role}
            </p>
            <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
            <span className="text-[12px] font-medium text-[#64748B]">
              {conv.online ? "Active now" : "Last seen recently"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-0.5">
        <button className="p-2.5 text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200">
          <MoreVertical className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ msg, conv, isGrouped, isLast }) {
  const isMe = msg.from === "me";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      layout
      className={`flex w-full ${isMe ? "justify-end" : "justify-start"} ${isGrouped ? "mt-1" : "mt-4"}`}
    >
      <div className={`flex w-[85%] lg:w-[75%] xl:w-[70%] gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} items-end`}>
        {!isMe && (
          <div className="w-8 shrink-0 flex flex-col justify-end mb-1">
            {isLast && (
              <Avatar 
                name={conv.name} 
                colorClass={conv.colorClass} 
                sizeClass="w-8 h-8" 
                textClass="text-[10px]" 
                showStatus={false}
              />
            )}
          </div>
        )}
        
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%]`}>
          <div
            className={`
              px-4 py-2.5 text-[14.5px] leading-relaxed shadow-sm
              ${isMe
                ? "bg-teal-600 text-white shadow-[0_2px_8px_rgba(20,184,166,0.15)]"
                : "bg-white border border-[#E5E7EB] text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              }
              ${isMe
                ? `rounded-2xl ${isLast ? "rounded-br-sm" : "rounded-br-2xl"} ${isGrouped ? "rounded-tr-md" : "rounded-tr-2xl"}`
                : `rounded-2xl ${isLast ? "rounded-bl-sm" : "rounded-bl-2xl"} ${isGrouped ? "rounded-tl-md" : "rounded-tl-2xl"}`
              }
              transition-all duration-200
            `}
          >
            {msg.text}
          </div>

          {isLast && (
            <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              <span className="text-[11px] font-medium text-[#94A3B8]">{msg.time}</span>
              {isMe && (
                <span className={msg.read ? "text-teal-600" : "text-[#CBD5E1]"}>
                  {msg.read ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ conv }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex w-full justify-start mt-4"
    >
      <div className="flex w-[85%] lg:w-[75%] xl:w-[70%] gap-3 flex-row items-end">
        <div className="w-8 shrink-0 flex flex-col justify-end mb-1">
          <Avatar 
            name={conv.name} 
            colorClass={conv.colorClass} 
            sizeClass="w-8 h-8" 
            textClass="text-[10px]" 
            showStatus={false}
          />
        </div>
        <div className="px-4 py-3.5 bg-white border border-[#E5E7EB] rounded-2xl rounded-bl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#CBD5E1] rounded-full"
              animate={{ 
                y: ["0%", "-60%", "0%"],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: i * 0.15 
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MessageList({ messages, conv, showTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  const grouped = messages.map((msg, i) => ({
    ...msg,
    isGrouped: i > 0 && messages[i - 1].from === msg.from,
    isLast: i === messages.length - 1 || messages[i + 1].from !== msg.from,
  }));

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-4 bg-[#F8FAFC] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8] [&::-webkit-scrollbar-thumb]:transition-colors">
      <div className="flex items-center justify-center mb-6 mt-2">
        <div className="h-px bg-[#E5E7EB] flex-1" />
        <span className="px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-[11px] font-semibold text-[#64748B] tracking-wide mx-4 shadow-sm">
          Today
        </span>
        <div className="h-px bg-[#E5E7EB] flex-1" />
      </div>
      
      <div className="flex flex-col max-w-4xl mx-auto">
        <AnimatePresence initial={false}>
          {grouped.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} conv={conv} isGrouped={msg.isGrouped} isLast={msg.isLast} />
          ))}
          {showTyping && <TypingIndicator key="typing" conv={conv} />}
        </AnimatePresence>
      </div>
      <div ref={bottomRef} className="h-4 shrink-0" />
    </div>
  );
}

function MessageComposer({ onSend }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaChange(e) {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }

  return (
    <div className="p-4 sm:p-5 bg-white shrink-0 border-t border-[#E5E7EB]">
      <div className="flex items-end gap-2.5 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500/30">
        <button className="p-2.5 text-[#94A3B8] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200 shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <textarea
          ref={(el) => {
            inputRef.current = el;
            textareaRef.current = el;
          }}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKey}
          placeholder="Write a message..."
          className="
            flex-1 max-h-32 min-h-[44px] 
            bg-transparent resize-none outline-none 
            py-2.5 px-2 
            text-[14.5px] text-[#111827] 
            placeholder:text-[#94A3B8] 
            leading-relaxed
            [&::-webkit-scrollbar]:w-1 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-[#E5E7EB] 
            [&::-webkit-scrollbar-thumb]:rounded-full
            self-center
          "
          rows={1}
        />
        
        <button className="p-2.5 text-[#94A3B8] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200 shrink-0">
          <Smile className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className={`
            flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 shrink-0
            ${value.trim() 
              ? "bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:shadow-md active:scale-95" 
              : "bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed border border-[#E5E7EB]"
            }
          `}
        >
          <Send className="w-4.5 h-4.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
      <div className="relative">
        <div className="w-20 h-20 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] to-white rounded-2xl" />
          <MessageSquare className="w-8 h-8 text-[#94A3B8] relative z-10" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
          <Users className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[#111827] tracking-tight mt-6 mb-2">Welcome to your workspace</h3>
      <p className="text-[14px] text-[#64748B] text-center max-w-sm leading-relaxed">
        Select an existing conversation from the sidebar or start a new one to collaborate with your team.
      </p>
    </div>
  );
}

// ─── ROOT COMPONENT ──────────────────────────────────────────
export default function Messenger() {
  const [activeId, setActiveId] = useState(1);
  const [convs, setConvs] = useState(CONVERSATIONS);
  const [msgMap, setMsgMap] = useState(MESSAGES_BY_CONV);
  const [showTyping, setShowTyping] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const typingTimer = useRef(null);

  const activeConv = convs.find((c) => c.id === activeId) || null;
  const messages = activeId ? msgMap[activeId] || msgMap.default : [];

  function selectConversation(id) {
    setActiveId(id);
    setMobileChatOpen(true);
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  const sendMessage = useCallback((text) => {
    if (!activeId) return;
    const newMsg = {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    
    setMsgMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || prev.default), newMsg],
    }));
    
    setConvs((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, lastMsg: text, time: newMsg.time } : c
      )
    );

    clearTimeout(typingTimer.current);
    setShowTyping(true);
    
    typingTimer.current = setTimeout(() => {
      setShowTyping(false);
      const replies = [
        "Got it, thanks! 👍",
        "Interesting point! Let me think about that.",
        "Absolutely, that makes perfect sense.",
        "Ha, that's a good one 😄",
        "Sure, I'll get back to you on that shortly.",
        "That's a great question!",
        "I appreciate the context, thank you.",
        "Let me review and come back to this.",
      ];
      const reply = {
        id: Date.now() + 1,
        from: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      
      setMsgMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || prev.default), reply],
      }));
      
      setConvs((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, lastMsg: reply.text, time: reply.time, unread: c.id === activeId ? c.unread : c.unread + 1 } : c
        )
      );
    }, 1500 + Math.random() * 1000);
  }, [activeId]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F8FAFC] text-[#111827] antialiased relative" style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      
      {/* Premium SaaS Ambient Background - Minimal & Clean */}
      <div className="absolute inset-0 bg-[#F8FAFC] pointer-events-none" />

      {/* Conversation List */}
      <ConversationList
        convs={convs}
        activeId={activeId}
        onSelect={selectConversation}
        isMobileHidden={mobileChatOpen}
      />

      {/* Chat Area */}
      <div className={`
        flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10 bg-white
        ${!mobileChatOpen ? "hidden lg:flex" : "flex"}
      `}>
        {activeConv ? (
          <>
            <ChatHeader conv={activeConv} onBack={() => setMobileChatOpen(false)} />
            <MessageList messages={messages} conv={activeConv} showTyping={showTyping} />
            <MessageComposer onSend={sendMessage} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>

    </div>
  );
}