/**
 * socketHandler.js
 * Wires up all Socket.io events: auth, messaging, presence, notifications.
 */
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { addUser, removeUser, getSocketIds } = require('./socketManager');

const initSocket = (io) => {

  // ── Auth middleware: every socket must send a valid JWT ────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = String(decoded.id);
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    addUser(userId, socket.id);

    // Join personal room so server can push to this user anytime
    socket.join(`user:${userId}`);
    console.log(`🔌 Socket connected  userId=${userId}  socketId=${socket.id}`);

    // ── Join a private chat room ───────────────────────────────────────────
    // roomId = sorted pair "uid1:uid2"  (deterministic, direction-agnostic)
    socket.on('chat:join', ({ otherUserId }) => {
      const room = [userId, String(otherUserId)].sort().join(':');
      socket.join(room);
    });

    // ── Send a DM ─────────────────────────────────────────────────────────
    socket.on('chat:send', async ({ toUserId, text, relatedJob, relatedApplication }) => {
      if (!text?.trim()) return;
      try {
        const participants = [userId, String(toUserId)].sort();
        const msg = await Message.create({
          participants,
          sender: userId,
          text: text.trim(),
          relatedJob: relatedJob || undefined,
          relatedApplication: relatedApplication || undefined,
          readBy: [userId],
        });

        const populated = await msg.populate('sender', 'name avatar role');

        // Broadcast to the private room (both participants)
        const room = participants.join(':');
        io.to(room).emit('chat:message', populated);

        // Also push to recipient's personal room in case they haven't joined chat room
        const recipientSockets = getSocketIds(String(toUserId));
        if (recipientSockets.length) {
          io.to(`user:${toUserId}`).emit('chat:message', populated);
        }
      } catch (err) {
        socket.emit('chat:error', { message: 'Failed to send message' });
        console.error('chat:send error', err.message);
      }
    });

    // ── Mark messages as read ─────────────────────────────────────────────
    socket.on('chat:read', async ({ otherUserId }) => {
      try {
        const participants = [userId, String(otherUserId)].sort();
        await Message.updateMany(
          { participants: { $all: participants }, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );
        // Inform sender their messages were read
        io.to(`user:${otherUserId}`).emit('chat:read_ack', { byUserId: userId });
      } catch (err) {
        console.error('chat:read error', err.message);
      }
    });

    // ── Typing indicator ──────────────────────────────────────────────────
    socket.on('chat:typing', ({ toUserId, isTyping }) => {
      io.to(`user:${toUserId}`).emit('chat:typing', { fromUserId: userId, isTyping });
    });

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      removeUser(userId, socket.id);
      console.log(`🔌 Socket disconnected userId=${userId} socketId=${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
