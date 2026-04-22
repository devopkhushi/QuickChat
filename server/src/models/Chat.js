const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    isGroup: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
