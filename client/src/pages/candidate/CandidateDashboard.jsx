import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as applicationService from '../../services/applicationService';
import * as savedJobService from '../../services/savedJobService';
import * as interviewService from '../../services/interviewService';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { FileCheck, Clock, Bookmark, Calendar, CheckCircle2, Award } from 'lucide-react';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.getCandidateApplications(),
      savedJobService.getSavedJobs(),
      interviewService.getInterviews()
    ]).then(([apps, saved, ints]) => {
      setApplications(apps || []);
      setSavedJobs(saved || []);
      setInterviews(ints || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading candidate dashboard stats..." />;

  const totalApps = applications.length;
  const underReview = applications.filter(a => a.status === 'Under Review').length;
  const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewScheduled = applications.filter(a => a.status === 'Interview Scheduled').length;
  const selected = applications.filter(a => a.status === 'Selected').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Candidate Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your active job applications, saved listings, and scheduled interviews</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}><FileCheck /></div>
          <div>
            <div className="stat-value">{totalApps}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}><Clock /></div>
          <div>
            <div className="stat-value">{underReview}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}><Award /></div>
          <div>
            <div className="stat-value">{shortlisted}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}><Calendar /></div>
          <div>
            <div className="stat-value">{interviewScheduled}</div>
            <div className="stat-label">Interviews</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}><CheckCircle2 /></div>
          <div>
            <div className="stat-value">{selected}</div>
            <div className="stat-label">Selected</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 114, 182, 0.15)', color: '#f472b6' }}><Bookmark /></div>
          <div>
            <div className="stat-value">{savedJobs.length}</div>
            <div className="stat-label">Saved Jobs</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Applications</h3>
          <Link to="/candidate/applications" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {applications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No job applications submitted yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.job?.jobTitle}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{app.job?.companyName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <Link to={'/candidate/applications/' + app._id} className="btn btn-outline btn-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
