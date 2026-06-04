import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios"; // ✅ replaced axios

export const useChat = () => {
  const socket = useSocket();
  const { currentUser } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Load conversations on mount ──────────────────
  const loadConversations = useCallback(() => {
    if (!currentUser) return;
    api
      .get("/api/chat/conversations") // ✅ no more hardcoded localhost
      .then((res) => setConversations(res.data.conversations))
      .catch((err) => console.log(err));
  }, [currentUser]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Socket listeners ─────────────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", ({ conversationId, message }) => {
      if (activeConversation?._id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, lastMessage: message } : c
        )
      );
    });

    socket.on("message_sent", ({ conversationId, message }) => {
      setMessages((prev) => [...prev, message]);
      setActiveConversation((prev) => ({
        ...prev,
        _id: conversationId,
        isNew: false,
      }));

      api
        .get("/api/chat/conversations") // ✅ no more hardcoded localhost
        .then((res) => setConversations(res.data.conversations))
        .catch((err) => console.log(err));
    });

    socket.on("user_typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("user_typing");
    };
  }, [socket, activeConversation]);

  // ── Open conversation with a user ────────────────
  const openConversation = useCallback(
    async (targetUser) => {
      setLoading(true);
      setMessages([]);
      try {
        const res = await api.get("/api/chat/conversations"); // ✅ no more hardcoded localhost
        const freshConversations = res.data.conversations;
        setConversations(freshConversations);

        const existing = freshConversations.find((c) =>
          c.members?.some((m) => m._id === targetUser._id)
        );

        if (existing) {
          setActiveConversation(existing);
          const msgRes = await api.get(
            `/api/chat/messages/${existing._id}` // ✅ no more hardcoded localhost
          );
          setMessages(msgRes.data.messages);
        } else {
          setActiveConversation({ members: [targetUser], isNew: true });
          setMessages([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ── Send message ──────────────────────────────────
  const sendMessage = useCallback(
    (receiverId, text) => {
      if (!text.trim() || !socket) return;
      socket.emit("send_message", {
        receiverId,
        text,
        conversationId: activeConversation?.isNew
          ? null
          : activeConversation?._id,
      });
    },
    [socket, activeConversation]
  );

  // ── Typing ────────────────────────────────────────
  const startTyping = useCallback(
    (receiverId) => socket?.emit("typing_start", { receiverId }),
    [socket]
  );

  const stopTyping = useCallback(
    (receiverId) => socket?.emit("typing_stop", { receiverId }),
    [socket]
  );

  return {
    conversations,
    messages,
    activeConversation,
    typingUsers,
    currentUser,
    loading,
    openConversation,
    sendMessage,
    startTyping,
    stopTyping,
  };
};