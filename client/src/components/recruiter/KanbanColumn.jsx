import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

const COLUMN_CONFIG = {
  'Applied': {
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.08)',
    headerBg: 'rgba(59,130,246,0.15)',
    emoji: '📥',
  },
  'Under Review': {
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.08)',
    headerBg: 'rgba(245,158,11,0.15)',
    emoji: '🔍',
  },
  'Shortlisted': {
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.08)',
    headerBg: 'rgba(139,92,246,0.15)',
    emoji: '⭐',
  },
  'Interview Scheduled': {
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.08)',
    headerBg: 'rgba(6,182,212,0.15)',
    emoji: '📅',
  },
  'Selected': {
    color: '#10b981',
    glow: 'rgba(16,185,129,0.08)',
    headerBg: 'rgba(16,185,129,0.15)',
    emoji: '🎉',
  },
  'Rejected': {
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.08)',
    headerBg: 'rgba(239,68,68,0.15)',
    emoji: '❌',
  },
};

const KanbanColumn = ({ columnId, applications, onScheduleInterview }) => {
  const config = COLUMN_CONFIG[columnId] || COLUMN_CONFIG['Applied'];
  const count = applications.length;

  return (
    <div style={{
      width: '260px',
      minWidth: '260px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '14px',
      background: 'rgba(15,23,42,0.6)',
      border: `1px solid ${config.color}30`,
      boxShadow: `0 4px 24px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      backdropFilter: 'blur(12px)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s ease',
    }}>
      {/* Column header */}
      <div style={{
        padding: '0.9rem 1rem',
        background: config.headerBg,
        borderBottom: `1px solid ${config.color}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '1rem' }}>{config.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: config.color, letterSpacing: '0.02em' }}>
            {columnId.toUpperCase()}
          </span>
        </div>
        <span style={{
          background: config.color + '25',
          color: config.color,
          border: `1px solid ${config.color}40`,
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.15rem 0.55rem',
          minWidth: '24px',
          textAlign: 'center',
        }}>
          {count}
        </span>
      </div>

      {/* Droppable cards area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              minHeight: '120px',
              padding: '0.75rem',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 320px)',
              background: snapshot.isDraggingOver
                ? `${config.color}08`
                : 'transparent',
              transition: 'background 0.15s ease',
            }}
          >
            {applications.length === 0 && !snapshot.isDraggingOver && (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0.5rem',
                color: '#334155',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: '1.5px dashed rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem', opacity: 0.4 }}>{config.emoji}</div>
                <span>Drop cards here</span>
              </div>
            )}

            {applications.map((app, index) => (
              <KanbanCard
                key={app._id}
                application={app}
                index={index}
                onScheduleInterview={onScheduleInterview}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
