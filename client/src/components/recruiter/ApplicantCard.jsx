import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import ResumeViewerModal from '../common/ResumeViewerModal';
import { User, FileText, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';

const ApplicantCard = ({ application, onStatusChange, onScheduleInterview }) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { _id, candidate, resumeUrl, coverLetter, status, appliedAt } = application;

  return (
    <div className="glass-card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {candidate?.avatar ? (
            <img src={candidate.avatar} alt={candidate.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="user-avatar-placeholder">{candidate?.name ? candidate.name[0].toUpperCase() : 'C'}</div>
          )}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{candidate?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={13} /> {candidate?.email}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={status} />

          <select
            className="form-control"
            value={status}
            onChange={(e) => onStatusChange(_id, e.target.value)}
            style={{ width: 'auto', padding: '0.35rem 2rem 0.35rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {coverLetter && (
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', borderLeft: '3px solid var(--accent-recruiter)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Cover Letter</span>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{coverLetter}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {resumeUrl ? (
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FileText size={15} color="#3b82f6" /> View Resume
            </button>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No resume attached</span>
          )}
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Applied {new Date(appliedAt).toLocaleDateString()}
          </span>
        </div>

        <button onClick={() => onScheduleInterview(application)} className="btn btn-recruiter btn-sm">
          <Calendar size={15} /> Schedule Interview
        </button>
      </div>

      {resumeUrl && (
        <ResumeViewerModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          resumeUrl={resumeUrl}
          candidateName={candidate?.name}
        />
      )}
    </div>
  );
};

export default ApplicantCard;
