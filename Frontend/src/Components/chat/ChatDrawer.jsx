import React, { useState, useEffect, useRef } from "react";

const ChatDrawer = ({
  isOpen,
  onClose,
  target,          // candidate object { _id, username, email }
  messages,
  currentUser,
  onSend,
  onTypingStart,
  onTypingStop,
  typingUsers,
}) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // clear input when target changes
  useEffect(() => {
    setInput("");
  }, [target]);

  const handleSend = () => {
    if (!input.trim() || !target) return;
    onSend(target._id, input.trim());
    setInput("");
    onTypingStop(target._id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onTypingStart(target._id);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => onTypingStop(target._id), 
      1500
    );
  };

  const isTargetTyping = target && typingUsers[target._id];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-[#0a0a0a] border-l border-white/[0.08] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.08] bg-white/[0.02]">
          {target && (
            <>
              <img
                src={`https://ui-avatars.com/api/?name=${target.username}&background=050505&color=9DFF13&bold=true`}
                alt={target.username}
                className="w-10 h-10 rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-white truncate">
                  {target.username}
                </h2>
                <p className="text-xs text-white/40 truncate">{target.email}</p>
              </div>
            </>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all ml-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#9DFF13]/10 border border-[#9DFF13]/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9DFF13" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm font-medium">
                Start the conversation
              </p>
              <p className="text-white/20 text-xs max-w-[200px]">
                Send a message to {target?.username} about the opportunity.
              </p>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) => {
            const isMine = msg.sender._id === currentUser?.id ||
                           msg.sender === currentUser?.id;
            return (
              <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed
                  ${isMine
                    ? "bg-[#9DFF13] text-[#050505] rounded-br-sm"
                    : "bg-white/[0.06] text-white/90 border border-white/[0.08] rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1 text-right
                    ${isMine ? "text-[#050505]/50" : "text-white/30"}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTargetTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-end gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-[#9DFF13]/40 transition-colors">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={`Message ${target?.username || ""}...`}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 resize-none outline-none leading-relaxed max-h-32"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#9DFF13] disabled:bg-[#9DFF13]/20 disabled:text-white/20 text-[#050505] transition-all hover:scale-105 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-white/20 mt-2 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </>
  );
};

export default ChatDrawer;