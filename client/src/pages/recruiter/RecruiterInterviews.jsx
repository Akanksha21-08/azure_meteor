import React, { useState, useEffect } from 'react';
import * as interviewService from '../../services/interviewService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar, Video, MapPin, Clock, User } from 'lucide-react';

const RecruiterInterviews = () => {
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

  if (loading) return <Loader text="Loading recruiter scheduled interviews..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Scheduled Candidate Interviews</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your upcoming candidate interview calendar</p>
      </div>

      {interviews.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No interviews scheduled yet.</p>
        </div>
      ) : (
        interviews.map(item => (
          <div key={item._id} className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.candidate?.name} &bull; <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.job?.jobTitle}</span></h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>{item.candidate?.email}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontWeight: 600 }}>
                <Calendar size={16} /> {item.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 600 }}>
                <Clock size={16} /> {item.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600 }}>
                {item.mode === 'Online' ? <Video size={16} /> : <MapPin size={16} />} {item.mode} Mode
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecruiterInterviews;
