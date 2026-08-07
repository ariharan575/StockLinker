import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, AlertCircle, RotateCcw, MoreVertical, Edit2, Trash2, X } from "lucide-react";

const bubbleVariants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export function MessageBubble({ msg, conv, isGrouped, isLast, onRetry, onEdit, onDelete }) {
  const isMe = msg.from === "me";
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(msg.text);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== msg.text) {
      onEdit(msg.id, editValue.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(msg.id);
    setShowMenu(false);
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 sm:px-6 ${isGrouped ? "mt-1" : "mt-4"} group relative`}
    >
      <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2">
          
          {/* Action Menu (Only visible on hover for 'me' messages that aren't deleted) */}
          {isMe && !msg._deleted && !msg._pending && !msg._failed && !isEditing && (
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              >
                <MoreVertical size={14} />
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: 10 }}
                    className="absolute right-6 top-0 w-32 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20"
                  >
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Edit2 size={12}/> Edit
                    </button>
                    <button onClick={handleDelete} className="w-full text-left px-3 py-2 text-[12px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100">
                      <Trash2 size={12}/> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* The Bubble */}
          <div
            className={`
              relative px-4 py-2.5 text-[14px] leading-relaxed break-words transition-all duration-200
              ${isEditing ? "w-[250px] sm:w-[300px] bg-white ring-2 ring-teal-500 rounded-2xl shadow-md" : 
                isMe
                ? `bg-teal-600 text-white shadow-sm
                   ${isGrouped ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tr-md"}`
                : `bg-[#F1F5F9] text-[#111827]
                   ${isGrouped ? "rounded-2xl rounded-tl-md" : "rounded-2xl rounded-tl-md"}`
              }
              ${msg._failed ? "ring-1 ring-red-400/60" : ""}
              ${msg._pending ? "opacity-70" : ""}
            `}
          >
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full text-[13px] text-slate-800 bg-transparent outline-none resize-none no-scrollbar"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-1 border-t border-slate-100 pt-1 mt-1">
                  <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-slate-100 text-slate-400 rounded-md"><X size={14}/></button>
                  <button onClick={handleEditSubmit} className="p-1 hover:bg-teal-50 text-teal-600 rounded-md"><Check size={14}/></button>
                </div>
              </div>
            ) : msg._deleted ? (
              <span className="italic text-[13px] opacity-70">This message was deleted</span>
            ) : (
              <span>{msg.text}</span>
            )}

            {msg._edited && !msg._deleted && !isEditing && (
              <span className={`text-[10px] ml-1.5 ${isMe ? "text-teal-100/80" : "text-[#94A3B8]"}`}>
                (edited)
              </span>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[11px] text-[#94A3B8] font-medium">{msg.time}</span>

          {isMe && isLast && !msg._failed && (
            <span className="text-teal-600">
              {msg._pending ? (
                <Check className="w-3.5 h-3.5 text-[#94A3B8]" />
              ) : msg.read ? (
                <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
              )}
            </span>
          )}

          {isMe && msg._failed && (
            <button
              onClick={() => onRetry?.(msg)}
              className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 font-medium transition-colors duration-150"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Failed</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}