import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as jobService from '../../services/jobService';
import * as interviewService from '../../services/interviewService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { Briefcase, Users, PlusCircle, Calendar, CheckCircle2 } from 'lucide-react';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobService.getMyJobs(),
      interviewService.getInterviews()
    ]).then(([myJobs, ints]) => {
      setJobs(myJobs || []);
      setInterviews(ints || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading recruiter dashboard stats..." />;

  const activeJobs = jobs.filter(j => j.status === 'active').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Recruiter Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your corporate job postings, applicant pipeline, and candidate interviews</p>
        </div>
        <Link to="/recruiter/create-job" className="btn btn-recruiter">
          <PlusCircle size={18} /> Post New Job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}><Briefcase /></div>
          <div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Total Jobs Posted</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}><CheckCircle2 /></div>
          <div>
            <div className="stat-value">{activeJobs}</div>
            <div className="stat-label">Active Job Openings</div>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}><Calendar /></div>
          <div>
            <div className="stat-value">{interviews.length}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Posted Jobs</h3>
          <Link to="/recruiter/my-jobs" className="btn btn-outline btn-sm">Manage All Jobs</Link>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven't posted any job openings yet.</p>
            <Link to="/recruiter/create-job" className="btn btn-recruiter btn-sm">Post First Job</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 5).map(j => (
                  <tr key={j._id}>
                    <td style={{ fontWeight: 600 }}>{j.jobTitle}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{j.location}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{j.jobType}</td>
                    <td><StatusBadge status={j.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={"/recruiter/jobs/" + j._id + "/applicants"} className="btn btn-recruiter btn-sm">
                          <Users size={14} /> Applicants
                        </Link>
                      </div>
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

export default RecruiterDashboard;
