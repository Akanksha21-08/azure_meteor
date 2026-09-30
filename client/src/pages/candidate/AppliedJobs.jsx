import React, { useState, useEffect } from 'react';
import * as applicationService from '../../services/applicationService';
import ApplicationCard from '../../components/candidate/ApplicationCard';
import Loader from '../../components/common/Loader';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = () => {
    applicationService.getCandidateApplications()
      .then(data => {
        setApplications(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await applicationService.withdrawApplication(id);
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || 'Error withdrawing application');
    }
  };

  if (loading) return <Loader text="Loading your applied jobs..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Applied Jobs</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your active job submissions and review status history</p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't applied for any jobs yet.</p>
        </div>
      ) : (
        applications.map(app => (
          <ApplicationCard key={app._id} application={app} onWithdraw={handleWithdraw} />
        ))
      )}
    </div>
  );
};

export default AppliedJobs;
