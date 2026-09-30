import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Bookmark, Building, Check } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import * as savedJobService from '../../services/savedJobService';

const JobCard = ({ job, onSaveToggle }) => {
  const { isCandidate } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    if (isCandidate && job._id) {
      savedJobService.checkSavedStatus(job._id)
        .then(res => setIsSaved(res.isSaved))
        .catch(() => setIsSaved(false));
    }
  }, [isCandidate, job._id]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCandidate || loadingSave) return;
    setLoadingSave(true);
    try {
      const res = await savedJobService.toggleSaveJob(job._id);
      setIsSaved(res.isSaved);
      if (onSaveToggle) onSaveToggle(job._id, res.isSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#60a5fa'
            }}>
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
              ) : (
                job.companyName ? job.companyName[0].toUpperCase() : 'C'
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <Link to={'/jobs/' + job._id}>{job.jobTitle}</Link>
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                <Building size={14} /> {job.companyName}
              </p>
            </div>
          </div>

          {isCandidate && (
            <button 
              onClick={handleSave}
              className="btn btn-outline btn-sm"
              title={isSaved ? 'Remove from saved' : 'Save job'}
              style={{
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: 0,
                color: isSaved ? '#3b82f6' : 'var(--text-secondary)',
                borderColor: isSaved ? '#3b82f6' : 'var(--border-color)',
                background: isSaved ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
              }}
            >
              <Bookmark size={16} fill={isSaved ? '#3b82f6' : 'none'} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} color="#60a5fa" /> {job.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Briefcase size={14} color="#a78bfa" /> {job.jobType} &bull; {job.workMode}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <DollarSign size={14} color="#34d399" />  -  / {job.salaryPeriod}
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {job.requiredSkills.slice(0, 4).map((skill, i) => (
              <span key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={'/jobs/' + job._id} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
