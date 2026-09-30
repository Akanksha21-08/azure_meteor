import React, { useState, useEffect } from 'react';
import * as interviewService from '../../services/interviewService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar, Video, MapPin, Clock, Building } from 'lucide-react';

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getInterviews()
      .then(data => {
        setInterviews(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading scheduled interviews..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Scheduled Interviews</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review upcoming interview dates, meeting links, and recruiter notes</p>
      </div>

      {interviews.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No scheduled interviews at this time.</p>
        </div>
      ) : (
        interviews.map(item => (
          <div key={item._id} className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.job?.jobTitle}</h3>
                <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                  <Building size={15} color="#60a5fa" /> {item.recruiter?.name} ({item.job?.companyName})
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 600 }}>
                <Calendar size={16} /> {item.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 600 }}>
                <Clock size={16} /> {item.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600 }}>
                {item.mode === 'Online' ? <Video size={16} /> : <MapPin size={16} />} {item.mode} Mode
              </span>
            </div>

            {item.mode === 'Online' && item.meetingLink && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Meeting Link: </span>
                <a href={item.meetingLink} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: '#60a5fa' }}>
                  {item.meetingLink}
                </a>
              </div>
            )}

            {item.mode === 'Offline' && item.location && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location Address: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{item.location}</strong>
              </div>
            )}

            {item.notes && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Recruiter Notes:</strong> {item.notes}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CandidateInterviews;
