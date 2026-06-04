const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

// GET all conversations
router.get("/conversations", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const conversations = await Conversation.find({ members: decoded.id })
      .populate("members", "username email")
      .sort({ updatedAt: -1 });
       console.log("conv members:", JSON.stringify(conversations[0]?.members));

    res.json({ success: true, conversations });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET messages
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;