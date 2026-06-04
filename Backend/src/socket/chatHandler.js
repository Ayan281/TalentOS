const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

function chatHandler(io, socket) {
  const userId = socket.user.id;

  // Step 1 — user joins their personal private room
  socket.join(userId);
  console.log(`👤 ${userId} joined their room`);

  // ── EVENT 1: Get all conversations ──────────────────
  socket.on("get_conversations", async () => {
    try {
      const conversations = await Conversation.find({ members: userId })
        .populate("members", "username email")
        .sort({ updatedAt: -1 });

      socket.emit("conversations_list", conversations);
    } catch (err) {
      socket.emit("error", { message: "Failed to fetch conversations" });
    }
  });

  // ── EVENT 2: Get messages of a conversation ──────────
  socket.on("get_messages", async ({ conversationId }) => {
    try {
      // Security check — is this user part of this conversation?
      const conversation = await Conversation.findById(conversationId);

      if (!conversation.members.includes(userId)) {
        return socket.emit("error", { message: "Unauthorized" });
      }

      const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 });

      // Mark messages as seen
      await Message.updateMany(
        { conversationId, receiver: userId, seen: false },
        { seen: true, seenAt: new Date() }
      );

      socket.emit("messages_list", messages);
    } catch (err) {
      socket.emit("error", { message: "Failed to fetch messages" });
    }
  });

  // ── EVENT 3: Send a message ──────────────────────────
  socket.on("send_message", async ({ receiverId, text, conversationId }) => {
      console.log("📨 send_message received:", { receiverId, text, conversationId });
  console.log("📨 sender:", userId);
    try {
      // Find existing conversation or create new one
      let conversation = await Conversation.findOne({
        members: { $all: [userId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          members: [userId, receiverId],
          unreadCount: { [receiverId]: 0 },
        });
      }

      // Save message to DB
      const message = await Message.create({
        conversationId: conversation._id,
        sender: userId,
        receiver: receiverId,
        text,
      });

      // Update conversation last message + increment unread
      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: { text, sender: userId, timestamp: new Date() },
        $inc: { [`unreadCount.${receiverId}`]: 1 },
      });

      // Deliver to receiver if online
      io.to(receiverId).emit("receive_message", {
        conversationId: conversation._id,
        message,
      });

      // Confirm back to sender
      socket.emit("message_sent", {
        conversationId: conversation._id,
        message,
      });

    } catch (err) {
      console.log(err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ── EVENT 4: Typing indicators ───────────────────────
  socket.on("typing_start", ({ receiverId }) => {
    io.to(receiverId).emit("user_typing", { userId, isTyping: true });
  });

  socket.on("typing_stop", ({ receiverId }) => {
    io.to(receiverId).emit("user_typing", { userId, isTyping: false });
  });

  // ── EVENT 5: Disconnect ──────────────────────────────
  socket.on("disconnect", () => {
    console.log(`❌ ${userId} disconnected`);
  });
}

module.exports = chatHandler;