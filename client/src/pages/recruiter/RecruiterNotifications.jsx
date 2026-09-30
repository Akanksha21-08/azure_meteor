import React, { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { CheckCheck } from 'lucide-react';

const RecruiterNotifications = () => {
  const { notifications, markRead, markAllRead } = useContext(NotificationContext);

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Recruiter Notifications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>New applicant submissions and status notifications</p>
        </div>

        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No notifications found.</p>
        </div>
      ) : (
        notifications.map(item => (
          <div 
            key={item._id} 
            onClick={() => markRead(item._id)}
            className="glass-card" 
            style={{ 
              marginBottom: '1rem', 
              padding: '1.25rem',
              background: item.read ? 'var(--bg-card)' : 'rgba(139, 92, 246, 0.1)',
              borderLeft: item.read ? '1px solid var(--border-color)' : '4px solid #8b5cf6',
              cursor: 'pointer'
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: item.read ? 'var(--text-primary)' : '#c084fc' }}>{item.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.message}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default RecruiterNotifications;
