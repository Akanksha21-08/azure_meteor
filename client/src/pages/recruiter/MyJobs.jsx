import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as jobService from '../../services/jobService';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { PlusCircle, Edit, Trash2, Users, Power } from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    jobService.getMyJobs()
      .then(data => {
        setJobs(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await jobService.toggleJobStatus(id);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling job status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobService.deleteJob(id);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job');
    }
  };

  if (loading) return <Loader text="Loading posted jobs..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Posted Jobs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your published positions, open/close listings, and review applicants</p>
        </div>
        <Link to="/recruiter/create-job" className="btn btn-recruiter">
          <PlusCircle size={18} /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No job postings created yet.</p>
          <Link to="/recruiter/create-job" className="btn btn-recruiter btn-sm">Create First Job</Link>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Job Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j._id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{j.jobTitle}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{j.jobType} ({j.workMode})</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{j.location}</td>
                    <td><StatusBadge status={j.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(j.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Link to={'/recruiter/jobs/' + j._id + '/applicants'} className="btn btn-recruiter btn-sm" title="View Applicants">
                          <Users size={14} /> Applicants
                        </Link>
                        <Link to={'/recruiter/edit-job/' + j._id} className="btn btn-outline btn-sm" title="Edit Job">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => handleToggleStatus(j._id)} className="btn btn-outline btn-sm" title={j.status === 'active' ? 'Close Job' : 'Publish Job'}>
                          <Power size={14} color={j.status === 'active' ? '#ef4444' : '#10b981'} />
                        </button>
                        <button onClick={() => handleDelete(j._id)} className="btn btn-danger btn-sm" title="Delete Job">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
