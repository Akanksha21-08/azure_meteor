import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as applicationService from '../../services/applicationService';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { Building, MapPin, FileText, Clock } from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplicationDetails(id)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading application details..." />;
  if (!data) return <p>Application not found.</p>;

  const { application } = data;
  const { job, status, statusHistory, coverLetter, resumeUrl } = application;

  return (
    <div style={{ maxWidth: '850px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{job?.jobTitle}</h1>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '4px' }}>
              <Building size={16} color="#60a5fa" /> {job?.companyName} &bull; <MapPin size={16} color="#a78bfa" /> {job?.location}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            <FileText size={16} color="#3b82f6" /> View Submitted Resume
          </a>
        </div>
      </div>

      {coverLetter && (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Cover Letter Submitted</h3>
          <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{coverLetter}</p>
        </div>
      )}

      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock color="#f59e0b" /> Application Status Timeline
        </h3>

        <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
          {statusHistory && statusHistory.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-1.65rem',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#3b82f6'
              }}></div>
              <StatusBadge status={item.status} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Updated on {new Date(item.updatedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
