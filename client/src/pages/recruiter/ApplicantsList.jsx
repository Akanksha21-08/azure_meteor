import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as applicationService from '../../services/applicationService';
import * as interviewService from '../../services/interviewService';
import ApplicantCard from '../../components/recruiter/ApplicantCard';
import InterviewModal from '../../components/recruiter/InterviewModal';
import Loader from '../../components/common/Loader';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  // Interview modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const fetchApplicants = () => {
    applicationService.getJobApplicants(jobId)
      .then(data => {
        setApplications(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      fetchApplicants();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleOpenInterview = (app) => {
    setSelectedApp(app);
    setIsInterviewModalOpen(true);
  };

  const handleScheduleInterviewSubmit = async (interviewData) => {
    try {
      await interviewService.scheduleInterview(interviewData);
      setIsInterviewModalOpen(false);
      fetchApplicants();
      alert('Interview scheduled & notification sent to candidate!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error scheduling interview');
    }
  };

  if (loading) return <Loader text="Fetching candidate applicants..." />;

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Applicants Review</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review candidate resumes, cover letters, and update pipeline status</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="form-control" 
            style={{ width: 'auto', padding: '0.35rem 2rem 0.35rem 0.75rem' }}
          >
            <option value="All">All Applicants ({applications.length})</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No candidate applications found for this filter.</p>
        </div>
      ) : (
        filteredApps.map(app => (
          <ApplicantCard 
            key={app._id} 
            application={app} 
            onStatusChange={handleStatusChange} 
            onScheduleInterview={handleOpenInterview}
          />
        ))
      )}

      {selectedApp && (
        <InterviewModal 
          isOpen={isInterviewModalOpen} 
          onClose={() => setIsInterviewModalOpen(false)} 
          application={selectedApp} 
          onSubmit={handleScheduleInterviewSubmit}
        />
      )}
    </div>
  );
};

export default ApplicantsList;
