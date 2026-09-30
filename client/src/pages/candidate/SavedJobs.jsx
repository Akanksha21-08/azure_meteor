import React, { useState, useEffect } from 'react';
import * as savedJobService from '../../services/savedJobService';
import JobCard from '../../components/jobs/JobCard';
import Loader from '../../components/common/Loader';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedJobService.getSavedJobs()
      .then(data => {
        setSavedJobs(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs(prev => prev.filter(item => item.job?._id !== jobId));
    }
  };

  if (loading) return <Loader text="Loading saved jobs..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Saved Jobs</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Bookmarked opportunities to review or apply later</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't bookmarked any jobs yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {savedJobs.map(item => (
            item.job && <JobCard key={item._id} job={item.job} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
