import React, { useState, useEffect, useRef } from "react";

const ChatPopup = ({
  isOpen,
  onClose,
  conversations,
  messages,
  activeConversation,
  currentUser,
  typingUsers,
  onOpenConversation,
  onSend,
  onTypingStart,
  onTypingStop,
  themeMode,
}) => {
  const [input, setInput] = useState("");
  const [view, setView] = useState("list"); // "list" | "chat"
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // auto scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // reset to list when closed
  useEffect(() => {
    if (!isOpen) {
      setView("list");
      setInput("");
    }
  }, [isOpen]);

  const handleOpenChat = (conversation) => {
    // find the other member (not current user)
    const otherMember = conversation.members?.find(
      (m) => m._id !== currentUser?.id
    );
    if (otherMember) {
      onOpenConversation(otherMember);
      setView("chat");
    }
  };

  const handleSend = () => {
    if (!input.trim() || !activeConversation) return;
    const otherMember = activeConversation.members?.find(
      (m) => m._id !== currentUser?.id
    );
    if (!otherMember) return;
    onSend(otherMember._id, input.trim());
    setInput("");
    onTypingStop(otherMember._id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const otherMember = activeConversation?.members?.find(
      (m) => m._id !== currentUser?.id
    );
    if (!otherMember) return;
    onTypingStart(otherMember._id);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => onTypingStop(otherMember._id),
      1500
    );
  };

  const otherMember = activeConversation?.members?.find(
    (m) => m._id !== currentUser?.id
  );
  const isTyping = otherMember && typingUsers[otherMember._id];

  const dark = themeMode === "dark";

  if (!isOpen) return null;

  return (
    <div className={`fixed top-24 right-6 w-[360px] rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden transition-all duration-300
      ${dark
        ? "bg-[#0a0a0a] border border-white/[0.08]"
        : "bg-white border border-black/[0.08]"
      }`}
      style={{ maxHeight: "520px" }}
    >

      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0
        ${dark ? "border-white/[0.08] bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.02]"}`}
      >
        {view === "chat" && otherMember ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setView("list")}
              className={`flex-shrink-0 ${dark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"} transition-colors`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <img
              src={`https://ui-avatars.com/api/?name=${otherMember.username}&background=050505&color=9DFF13&bold=true`}
              className="w-8 h-8 rounded-lg flex-shrink-0"
            />
            <div className="min-w-0">
              <p className={`text-sm font-bold truncate ${dark ? "text-white" : "text-black"}`}>
                {otherMember.username}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DFF13" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className={`text-sm font-bold ${dark ? "text-white" : "text-black"}`}>
              Messages
            </span>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-all
            ${dark ? "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white" : "bg-black/5 hover:bg-black/10 text-black/50 hover:text-black"}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Conversation List View */}
      {view === "list" && (
        <div className="flex-1 overflow-y-auto">
          {conversations?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 px-6 text-center">
              <p className={`text-sm font-medium ${dark ? "text-white/40" : "text-black/40"}`}>
                No messages yet
              </p>
              <p className={`text-xs ${dark ? "text-white/20" : "text-black/20"}`}>
                Recruiters will message you here
              </p>
            </div>
          ) : (
            conversations?.map((conv) => {
              const other = conv.members?.find(
                (m) => m._id !== currentUser?.id
              );
              if (!other) return null;
              const unread = conv.unreadCount?.[currentUser?.id] || 0;

              return (
                <button
                  key={conv._id}
                  onClick={() => handleOpenChat(conv)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 transition-all text-left border-b
                    ${dark
                      ? "border-white/[0.05] hover:bg-white/[0.04]"
                      : "border-black/[0.04] hover:bg-black/[0.03]"
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${other.username}&background=050505&color=9DFF13&bold=true`}
                      className="w-10 h-10 rounded-xl"
                    />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#9DFF13] rounded-full text-[#050505] text-[9px] font-black flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${dark ? "text-white" : "text-black"}`}>
                      {other.username}
                    </p>
                    <p className={`text-xs truncate mt-0.5 ${dark ? "text-white/40" : "text-black/40"}`}>
                      {conv.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Chat View */}
      {view === "chat" && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-20">
                <p className={`text-xs ${dark ? "text-white/30" : "text-black/30"}`}>
                  No messages yet — say hi!
                </p>
              </div>
            )}

            {messages.map((msg, i) => {
              const isMine =
                msg.sender._id === currentUser?.id ||
                msg.sender === currentUser?.id;
              return (
                <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed
                    ${isMine
                      ? "bg-[#9DFF13] text-[#050505] rounded-br-sm font-medium"
                      : dark
                        ? "bg-white/[0.06] text-white/90 border border-white/[0.08] rounded-bl-sm"
                        : "bg-black/[0.06] text-black/90 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[10px] mt-0.5 text-right
                      ${isMine ? "text-[#050505]/50" : dark ? "text-white/30" : "text-black/30"}`}
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
            {isTyping && (
              <div className="flex justify-start">
                <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5
                  ${dark ? "bg-white/[0.06] border border-white/[0.08]" : "bg-black/[0.06]"}`}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className={`w-1.5 h-1.5 rounded-full animate-bounce ${dark ? "bg-white/40" : "bg-black/40"}`}
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={`px-4 py-3 border-t flex-shrink-0
            ${dark ? "border-white/[0.08] bg-white/[0.02]" : "border-black/[0.06]"}`}
          >
            <div className={`flex items-end gap-2 rounded-xl px-3 py-2 border
              ${dark
                ? "bg-white/[0.04] border-white/[0.08] focus-within:border-[#9DFF13]/40"
                : "bg-black/[0.03] border-black/[0.08] focus-within:border-[#9DFF13]/60"
              } transition-colors`}
            >
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Type a message..."
                className={`flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed max-h-24
                  ${dark ? "text-white placeholder-white/30" : "text-black placeholder-black/30"}`}
                style={{ scrollbarWidth: "none" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#9DFF13] disabled:bg-[#9DFF13]/20 disabled:text-white/20 text-[#050505] transition-all hover:scale-105 active:scale-95"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPopup;