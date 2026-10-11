/**
 * socketManager.js
 * Central registry mapping userId → Set<socketId>
 * Supports multiple browser tabs per user.
 */

// Map<userId(string) → Set<socketId(string)>>
const onlineUsers = new Map();

const addUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const removeUser = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(userId);
};

const getSocketIds = (userId) => {
  return [...(onlineUsers.get(String(userId)) || [])];
};

const isOnline = (userId) => onlineUsers.has(String(userId));

module.exports = { addUser, removeUser, getSocketIds, isOnline };
