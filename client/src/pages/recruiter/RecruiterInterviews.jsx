import React, { useState, useEffect, useCallback } from 'react';
import * as interviewService from '../../services/interviewService';
import Loader from '../../components/common/Loader';
import ResumeViewerModal from '../../components/common/ResumeViewerModal';
import { Calendar, Video, MapPin, Clock, User, ExternalLink, FileText, CheckCircle2, XCircle, ChevronDown, Mail } from 'lucide-react';

const STATUS_CONFIG = {
  Scheduled:  { color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  label: 'Scheduled' },
  Completed:  { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: 'Completed' },
  Cancelled:  { color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  label: 'Cancelled' },
};

// ---- Small toast ----
const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
    border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
    color: type === 'success' ? '#34d399' : '#f87171',
    borderRadius: '10px', padding: '0.85rem 1.25rem',
    fontSize: '0.88rem', fontWeight: 600,
    backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'slideInRight 0.3s ease', maxWidth: '340px',
  }}>
    <span>{type === 'success' ? '✅' : '❌'}</span>
    <span>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', marginLeft: 'auto', fontSize: '1rem' }}>×</button>
  </div>
);

const InterviewCard = ({ item, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Scheduled;
  const resumeUrl = item.application?.resumeUrl;

  const handleMarkAs = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusChange(item._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(15,23,42,0.75)', border: `1px solid rgba(255,255,255,0.07)`,
      borderLeft: `3px solid ${cfg.color}`, borderRadius: '14px',
      padding: '1.5rem 1.75rem', marginBottom: '1.25rem',
      backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      transition: 'box-shadow 0.2s ease',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${cfg.color}, #8b5cf6)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1.1rem',
          }}>
            {item.candidate?.name ? item.candidate.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              {item.candidate?.name}
              <span style={{ fontWeight: 400, color: 'var(--text-secondary)', margin: '0 0.4rem' }}>for</span>
              <span style={{ color: cfg.color }}>{item.job?.jobTitle}</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
              <Mail size={12} /> {item.candidate?.email}
            </p>
          </div>
        </div>

        {/* Status pill */}
        <span style={{
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
          padding: '0.3rem 0.9rem', borderRadius: '9999px',
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Details row */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
        background: 'rgba(15,23,42,0.5)', padding: '0.85rem 1.1rem',
        borderRadius: '10px', marginBottom: '1rem',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontWeight: 600, fontSize: '0.88rem' }}>
          <Calendar size={15} /> {item.date}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 600, fontSize: '0.88rem' }}>
          <Clock size={15} /> {item.time}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600, fontSize: '0.88rem' }}>
          {item.mode === 'Online' ? <Video size={15} /> : <MapPin size={15} />} {item.mode}
        </span>

        {/* Meeting link or location */}
        {item.mode === 'Online' && item.meetingLink && (
          <a
            href={item.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.82rem', fontWeight: 600, color: '#60a5fa',
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={13} /> Join Meeting
          </a>
        )}
        {item.mode === 'Offline' && item.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.82rem' }}>
            <MapPin size={13} /> {item.location}
          </span>
        )}
      </div>

      {/* Notes (collapsible) */}
      {item.notes && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, padding: 0,
            }}
          >
            <FileText size={12} />
            {expanded ? 'Hide Notes' : 'View Notes'}
            <ChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
          {expanded && (
            <div style={{
              marginTop: '0.5rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6,
              background: 'rgba(15,23,42,0.5)', borderRadius: '8px',
              padding: '0.65rem 0.9rem', borderLeft: '2px solid #475569',
            }}>
              {item.notes}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {resumeUrl && (
          <button
            type="button"
            onClick={() => setIsResumeOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem',
              fontWeight: 600, cursor: 'pointer',
              background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={13} /> View Resume
          </button>
        )}

        {item.status === 'Scheduled' && (
          <>
            <button
              disabled={updating}
              onClick={() => handleMarkAs('Completed')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem',
                fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer',
                background: 'rgba(16,185,129,0.15)', color: '#34d399',
                border: '1px solid rgba(16,185,129,0.3)',
                opacity: updating ? 0.5 : 1, transition: 'all 0.15s ease',
              }}
            >
              <CheckCircle2 size={13} /> Mark Completed
            </button>
            <button
              disabled={updating}
              onClick={() => handleMarkAs('Cancelled')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem',
                fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer',
                background: 'rgba(239,68,68,0.12)', color: '#f87171',
                border: '1px solid rgba(239,68,68,0.25)',
                opacity: updating ? 0.5 : 1, transition: 'all 0.15s ease',
              }}
            >
              <XCircle size={13} /> Cancel Interview
            </button>
          </>
        )}
      </div>

      {resumeUrl && (
        <ResumeViewerModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          resumeUrl={resumeUrl}
          candidateName={item.candidate?.name}
        />
      )}
    </div>
  );
};

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'Scheduled' | 'Completed' | 'Cancelled'
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInterviews = useCallback(() => {
    interviewService.getInterviews()
      .then(data => {
        setInterviews(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await interviewService.updateInterview(id, { status: newStatus });
      setInterviews(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
      showToast(`Interview marked as ${newStatus}`);
    } catch {
      showToast('Failed to update interview status', 'error');
    }
  };

  if (loading) return <Loader text="Loading your interview calendar..." />;

  const scheduled  = interviews.filter(i => i.status === 'Scheduled').length;
  const completed  = interviews.filter(i => i.status === 'Completed').length;
  const cancelled  = interviews.filter(i => i.status === 'Cancelled').length;

  const filtered = filter === 'all' ? interviews : interviews.filter(i => i.status === filter);

  const TAB_FILTERS = [
    { key: 'all',       label: 'All',       count: interviews.length, color: '#60a5fa' },
    { key: 'Scheduled', label: 'Scheduled',  count: scheduled,         color: '#22d3ee' },
    { key: 'Completed', label: 'Completed',  count: completed,         color: '#34d399' },
    { key: 'Cancelled', label: 'Cancelled',  count: cancelled,         color: '#f87171' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Candidate Interviews</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Manage and track all scheduled candidate interviews
        </p>
      </div>

      {/* Stats chips */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TAB_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: filter === f.key ? `${f.color}20` : 'rgba(30,41,59,0.6)',
              color: filter === f.key ? f.color : '#64748b',
              border: filter === f.key ? `1px solid ${f.color}50` : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {f.label}
            <span style={{
              fontSize: '0.72rem', fontWeight: 800,
              background: filter === f.key ? `${f.color}25` : 'rgba(255,255,255,0.06)',
              color: filter === f.key ? f.color : '#475569',
              padding: '0.1rem 0.45rem', borderRadius: '9999px',
            }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Interview list */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.4 }}>📅</div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            {filter === 'all' ? 'No interviews scheduled yet.' : `No ${filter.toLowerCase()} interviews.`}
          </p>
        </div>
      ) : (
        filtered.map(item => (
          <InterviewCard key={item._id} item={item} onStatusChange={handleStatusChange} />
        ))
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RecruiterInterviews;
