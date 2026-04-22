const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');
const Chat = require('./models/Chat');

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    await User.findByIdAndUpdate(socket.user.id, { online: true }).catch(() => {});

    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
    });

    socket.on('send-message', async ({ chatId, text }) => {
      if (!text || !text.trim()) return;

      try {
        const msg = await Message.create({
          chat: chatId,
          sender: socket.user.id,
          text: text.trim(),
          readBy: [socket.user.id]
        });

        await Chat.findByIdAndUpdate(chatId, { lastMessage: msg._id });
        await msg.populate('sender', 'name avatar _id');
        io.to(chatId).emit('message', msg);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('typing', ({ chatId }) => {
      socket.to(chatId).emit('typing', { userId: socket.user.id });
    });

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.user.id, { online: false }).catch(() => {});
    });
  });
};
