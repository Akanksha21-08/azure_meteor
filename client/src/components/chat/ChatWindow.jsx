/**
 * ChatWindow.jsx
 * Floating DM chat window between recruiter ↔ candidate.
 * Supports real-time messaging via Socket.io + REST history load.
 */
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { getThread } from '../../services/messageService';
import { X, Send, Minimize2, MessageSquare } from 'lucide-react';

const ChatWindow = ({ peer, jobTitle, relatedJob, relatedApplication, onClose }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(0);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const inputRef = useRef(null);

  // ── Load history ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!peer?._id) return;
    getThread(peer._id)
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [peer?._id]);

  // ── Join chat room & listen for new messages ──────────────────────────────
  useEffect(() => {
    if (!socket || !peer?._id) return;
    socket.emit('chat:join', { otherUserId: peer._id });
    socket.emit('chat:read', { otherUserId: peer._id });

    const handleMessage = (msg) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (minimized && msg.sender._id !== user._id) {
        setUnreadBadge((b) => b + 1);
      }
      // Mark as read if window is open
      if (!minimized) {
        socket.emit('chat:read', { otherUserId: peer._id });
      }
    };

    const handleTyping = ({ fromUserId, isTyping: typing }) => {
      if (String(fromUserId) === String(peer._id)) setIsTyping(typing);
    };

    const handleReadAck = () => {
      // Could mark our messages as "seen" — for now just a console log
    };

    socket.on('chat:message', handleMessage);
    socket.on('chat:typing', handleTyping);
    socket.on('chat:read_ack', handleReadAck);

    return () => {
      socket.off('chat:message', handleMessage);
      socket.off('chat:typing', handleTyping);
      socket.off('chat:read_ack', handleReadAck);
    };
  }, [socket, peer?._id, minimized, user._id]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, minimized]);

  // Reset badge on open
  useEffect(() => {
    if (!minimized) {
      setUnreadBadge(0);
      socket?.emit('chat:read', { otherUserId: peer._id });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [minimized]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!text.trim() || !socket) return;
    socket.emit('chat:send', {
      toUserId: peer._id,
      text: text.trim(),
      relatedJob,
      relatedApplication,
    });
    setText('');
    // Stop typing indicator
    socket.emit('chat:typing', { toUserId: peer._id, isTyping: false });
  }, [text, socket, peer._id, relatedJob, relatedApplication]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Typing indicator debounce ─────────────────────────────────────────────
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!socket) return;
    socket.emit('chat:typing', { toUserId: peer._id, isTyping: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('chat:typing', { toUserId: peer._id, isTyping: false });
    }, 2000);
  };

  const myId = String(user._id || user.id);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: minimized ? '1.5rem' : '1.5rem',
      width: minimized ? 'auto' : '360px',
      zIndex: 1100,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      border: '1px solid rgba(139,92,246,0.35)',
      background: 'rgba(15,23,42,0.98)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
      fontFamily: 'inherit',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        onClick={() => setMinimized((m) => !m)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.65rem',
          padding: '0.85rem 1rem',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.15))',
          borderBottom: minimized ? 'none' : '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '0.85rem',
          border: '2px solid rgba(139,92,246,0.5)',
        }}>
          {peer?.name?.[0]?.toUpperCase() || '?'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {peer?.name}
          </div>
          {jobTitle && (
            <div style={{ fontSize: '0.72rem', color: '#7c3aed', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              re: {jobTitle}
            </div>
          )}
        </div>

        {/* Unread badge on minimize */}
        {minimized && unreadBadge > 0 && (
          <div style={{
            background: '#8b5cf6', color: 'white', borderRadius: '9999px',
            fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.45rem', minWidth: '20px',
            textAlign: 'center',
          }}>{unreadBadge}</div>
        )}

        <div style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMinimized((m) => !m); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.15rem' }}
            title={minimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.15rem' }}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      {!minimized && (
        <>
          {/* Messages list */}
          <div style={{
            height: '340px', overflowY: 'auto',
            padding: '0.85rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.08) transparent',
          }}>
            {loading && (
              <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.82rem', paddingTop: '4rem' }}>
                Loading messages...
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#334155', fontSize: '0.82rem', paddingTop: '3rem' }}>
                <MessageSquare size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem', display: 'block' }} />
                No messages yet.<br />Start the conversation!
              </div>
            )}

            {messages.map((msg, i) => {
              const isMine = String(msg.sender?._id || msg.sender) === myId;
              const showAvatar = i === 0 || String(messages[i - 1].sender?._id || messages[i - 1].sender) !== String(msg.sender?._id || msg.sender);

              return (
                <div key={msg._id || i} style={{ display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', gap: '0.4rem', alignItems: 'flex-end' }}>
                  {/* Avatar */}
                  {showAvatar && !isMine ? (
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.65rem',
                    }}>
                      {peer?.name?.[0]?.toUpperCase()}
                    </div>
                  ) : <div style={{ width: '24px', flexShrink: 0 }} />}

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '78%',
                    padding: '0.55rem 0.8rem',
                    borderRadius: isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: isMine
                      ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                      : 'rgba(51,65,85,0.9)',
                    color: isMine ? '#f8fafc' : '#e2e8f0',
                    fontSize: '0.83rem',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                    boxShadow: isMine ? '0 2px 12px rgba(124,58,237,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                  }}>
                    {msg.text}
                    <div style={{ fontSize: '0.62rem', color: isMine ? 'rgba(255,255,255,0.5)' : '#475569', marginTop: '0.2rem', textAlign: 'right' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <div style={{
                  padding: '0.5rem 0.8rem', borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(51,65,85,0.8)', display: 'flex', gap: '3px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%', background: '#64748b',
                      animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ─────────────────────────────────────────────────── */}
          <div style={{
            padding: '0.65rem 0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-end',
            background: 'rgba(15,23,42,0.6)',
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              style={{
                flex: 1, resize: 'none', maxHeight: '80px', overflowY: 'auto',
                background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#f1f5f9', fontSize: '0.85rem',
                padding: '0.5rem 0.75rem',
                fontFamily: 'inherit', outline: 'none',
                transition: 'border-color 0.15s',
                lineHeight: 1.5,
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: text.trim() ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(51,65,85,0.6)',
                border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: text.trim() ? 'white' : '#475569',
                transition: 'all 0.15s',
                boxShadow: text.trim() ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </>
      )}

      {/* Typing dot animation */}
      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
