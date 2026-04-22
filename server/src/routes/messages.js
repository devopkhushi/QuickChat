const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

const router = express.Router();

router.post('/chat', auth, async (req, res) => {
  const { memberIds = [], name = '', isGroup = false } = req.body;

  if (!Array.isArray(memberIds) || memberIds.length < 2) {
    return res.status(400).json({ message: 'At least two members are required' });
  }

  try {
    const uniqueIds = [...new Set(memberIds.map(String))];

    let chat;
    if (!isGroup && uniqueIds.length === 2) {
      chat = await Chat.findOne({
        isGroup: false,
        members: { $all: uniqueIds, $size: 2 }
      });
    }

    if (!chat) {
      chat = await Chat.create({
        name: name || '',
        isGroup: !!isGroup,
        members: uniqueIds
      });
    }

    const populated = await Chat.findById(chat._id).populate('members', 'name email online avatar');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar _id')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:chatId/messages', auth, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Message text is required' });
  }

  try {
    const msg = await Message.create({
      chat: req.params.chatId,
      sender: req.user.id,
      text: text.trim(),
      readBy: [req.user.id]
    });

    await Chat.findByIdAndUpdate(req.params.chatId, { lastMessage: msg._id });
    await msg.populate('sender', 'name avatar _id');
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
