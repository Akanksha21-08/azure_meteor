import api from './api';

// Fetch chat thread with another user
export const getThread = (otherUserId, page = 1) =>
  api.get(`/messages/${otherUserId}?page=${page}&limit=50`).then((r) => r.data);

// Fetch all conversations (inbox)
export const getConversations = () =>
  api.get('/messages/conversations').then((r) => r.data);

// Get unread DM badge count
export const getUnreadCount = () =>
  api.get('/messages/unread-count').then((r) => r.data);
