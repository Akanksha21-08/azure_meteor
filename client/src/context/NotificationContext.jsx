/**
 * NotificationContext.jsx
 * Replaces 15s polling with instant Socket.io push.
 * Also shows an in-app toast when a new notification arrives.
 */
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import * as notificationService from '../services/notificationService';

export const NotificationContext = createContext();

// ── In-app toast component (self-contained, no extra deps) ────────────────────
const Toast = ({ notif, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const ICONS = {
    status_updated:        '🔔',
    interview_scheduled:   '📅',
    application_submitted: '📥',
    application_withdrawn: '📤',
    message:               '💬',
  };

  return (
    <div style={{
      position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 9998,
      minWidth: '300px', maxWidth: '380px',
      background: 'rgba(30,41,59,0.97)',
      border: '1px solid rgba(139,92,246,0.4)',
      borderLeft: '4px solid #8b5cf6',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(20px)',
      animation: 'slideInRight 0.3s ease',
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>
        {ICONS[notif.type] || '🔔'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f1f5f9', marginBottom: '0.2rem' }}>
          {notif.title}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
          {notif.message}
        </div>
      </div>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#64748b', fontSize: '1.1rem', lineHeight: 1, flexShrink: 0,
      }}>×</button>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const fetchedRef = useRef(false);

  // Initial fetch
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchedRef.current = true;
    } else {
      setNotifications([]);
      setUnreadCount(0);
      fetchedRef.current = false;
    }
  }, [user, fetchNotifications]);

  // ── Socket.io real-time listener ────────────────────────────────────────
  useEffect(() => {
    if (!socket || !user) return;

    const handleNew = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setToast(notif); // show toast popup
    };

    socket.on('notification:new', handleNew);
    return () => socket.off('notification:new', handleNew);
  }, [socket, user]);

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markRead, markAllRead }}>
      {children}
      {toast && <Toast notif={toast} onClose={() => setToast(null)} />}
    </NotificationContext.Provider>
  );
};
