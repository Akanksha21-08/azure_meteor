import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FileText, Calendar, Mail, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import ResumeViewerModal from '../common/ResumeViewerModal';

const COLUMN_COLORS = {
  'Applied': { border: '#3b82f6', glow: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
  'Under Review': { border: '#f59e0b', glow: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
  'Shortlisted': { border: '#8b5cf6', glow: 'rgba(139,92,246,0.12)', text: '#c084fc' },
  'Interview Scheduled': { border: '#06b6d4', glow: 'rgba(6,182,212,0.12)', text: '#22d3ee' },
  'Selected': { border: '#10b981', glow: 'rgba(16,185,129,0.12)', text: '#34d399' },
  'Rejected': { border: '#ef4444', glow: 'rgba(239,68,68,0.12)', text: '#f87171' },
};

const KanbanCard = ({ application, index, onScheduleInterview }) => {
  const [expanded, setExpanded] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { _id, candidate, resumeUrl, coverLetter, status, appliedAt } = application;
  const colors = COLUMN_COLORS[status] || COLUMN_COLORS['Applied'];

  return (
    <>
      <Draggable draggableId={_id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '0.75rem',
            background: snapshot.isDragging
              ? 'rgba(51,65,85,0.98)'
              : 'rgba(30,41,59,0.85)',
            border: `1px solid ${snapshot.isDragging ? colors.border : 'rgba(255,255,255,0.1)'}`,
            borderLeft: `3px solid ${colors.border}`,
            borderRadius: '10px',
            padding: '0.9rem 1rem',
            boxShadow: snapshot.isDragging
              ? `0 16px 40px rgba(0,0,0,0.5), 0 0 0 2px ${colors.border}40`
              : `0 2px 8px rgba(0,0,0,0.2)`,
            cursor: 'grab',
            transform: snapshot.isDragging ? 'rotate(2deg) scale(1.02)' : undefined,
            transition: snapshot.isDragging ? 'none' : 'all 0.18s ease',
            backdropFilter: 'blur(12px)',
            userSelect: 'none',
          }}
        >
          {/* Drag handle indicator */}
          <div style={{
            width: '24px',
            height: '3px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '9999px',
            margin: '0 auto 0.65rem',
          }} />

          {/* Candidate avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            {candidate?.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.border}` }}
              />
            ) : (
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${colors.border}, #8b5cf6)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.85rem'
              }}>
                {candidate?.name ? candidate.name[0].toUpperCase() : 'C'}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {candidate?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Mail size={10} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{candidate?.email}</span>
              </div>
            </div>
          </div>

          {/* Status chip + Applied date row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#475569' }}>
              Applied {new Date(appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
              padding: '0.15rem 0.5rem', borderRadius: '9999px',
              background: colors.glow, color: colors.text,
              border: `1px solid ${colors.border}40`,
              textTransform: 'uppercase',
            }}>
              {status}
            </span>
          </div>

          {/* Expand / collapse cover letter */}
          {coverLetter && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: colors.text, fontSize: '0.75rem', fontWeight: 600,
                padding: '0', marginBottom: expanded ? '0.5rem' : '0.7rem'
              }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? 'Hide Cover Letter' : 'View Cover Letter'}
            </button>
          )}

          {expanded && coverLetter && (
            <div style={{
              fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5,
              background: 'rgba(15,23,42,0.6)', borderRadius: '6px',
              padding: '0.6rem 0.75rem', marginBottom: '0.7rem',
              borderLeft: `2px solid ${colors.border}`,
              maxHeight: '100px', overflowY: 'auto',
            }}>
              {coverLetter}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {resumeUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsResumeOpen(true);
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem',
                  fontWeight: 600, background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.25)', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileText size={11} /> Resume
              </button>
            )}
            {!['Interview Scheduled', 'Selected', 'Rejected'].includes(status) && (
              <button
                onClick={(e) => { e.stopPropagation(); onScheduleInterview(application); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem',
                  fontWeight: 600, background: 'rgba(139,92,246,0.15)', color: '#c084fc',
                  border: '1px solid rgba(139,92,246,0.25)', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Calendar size={11} /> Schedule Interview
              </button>
            )}
            {status === 'Interview Scheduled' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem',
                fontWeight: 600, color: '#22d3ee',
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.2)',
              }}>
                <Calendar size={11} /> Scheduled ✓
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>

    {resumeUrl && (
      <ResumeViewerModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl={resumeUrl}
        candidateName={candidate?.name}
      />
    )}
  </>
);
};

export default KanbanCard;
