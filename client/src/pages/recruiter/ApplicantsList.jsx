import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import * as applicationService from '../../services/applicationService';
import * as interviewService from '../../services/interviewService';
import * as jobService from '../../services/jobService';
import KanbanColumn from '../../components/recruiter/KanbanColumn';
import InterviewModal from '../../components/recruiter/InterviewModal';
import Loader from '../../components/common/Loader';
import ResumeViewerModal from '../../components/common/ResumeViewerModal';
import { LayoutGrid, List, Users, CheckCircle2, Clock, Calendar, Briefcase, FileText } from 'lucide-react';

// --- Pipeline column order ---
const PIPELINE_COLUMNS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
];

// Split flat application array into column buckets
const buildColumns = (applications) => {
  const cols = {};
  PIPELINE_COLUMNS.forEach((col) => { cols[col] = []; });
  applications.forEach((app) => {
    const col = PIPELINE_COLUMNS.includes(app.status) ? app.status : 'Applied';
    cols[col].push(app);
  });
  return cols;
};

// --- Toast notification ---
const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
    border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
    color: type === 'success' ? '#34d399' : '#f87171',
    borderRadius: '10px',
    padding: '0.85rem 1.25rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'slideInRight 0.3s ease',
    maxWidth: '340px',
  }}>
    <span>{type === 'success' ? '✅' : '❌'}</span>
    <span>{message}</span>
    <button
      onClick={onClose}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'inherit', marginLeft: 'auto', fontSize: '1rem', lineHeight: 1
      }}
    >×</button>
  </div>
);

const ApplicantsList = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [columns, setColumns] = useState(buildColumns([]));
  const [loading, setLoading] = useState(true);
  const [jobInfo, setJobInfo] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [isUpdating, setIsUpdating] = useState(false);

  // Interview modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Resume viewer modal
  const [viewerResume, setViewerResume] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApplicants = useCallback(() => {
    applicationService.getJobApplicants(jobId)
      .then((data) => {
        const apps = data || [];
        setApplications(apps);
        setColumns(buildColumns(apps));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  // Fetch job info for the page header
  useEffect(() => {
    jobService.getJobById(jobId)
      .then((data) => setJobInfo(data))
      .catch(() => { });
  }, [jobId]);

  // ---- Kanban drag end handler ----
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Optimistic update: reorder columns in UI immediately
    const newCols = { ...columns };
    const sourceItems = [...newCols[sourceCol]];
    const destItems = sourceCol === destCol ? sourceItems : [...newCols[destCol]];

    const [movedApp] = sourceItems.splice(source.index, 1);
    const updatedApp = { ...movedApp, status: destCol };

    if (sourceCol === destCol) {
      sourceItems.splice(destination.index, 0, updatedApp);
      newCols[sourceCol] = sourceItems;
    } else {
      destItems.splice(destination.index, 0, updatedApp);
      newCols[sourceCol] = sourceItems;
      newCols[destCol] = destItems;
    }

    setColumns(newCols);
    setIsUpdating(true);

    try {
      await applicationService.updateApplicationStatus(draggableId, destCol);
      showToast(`Moved to "${destCol}" — candidate notified!`);
    } catch (err) {
      // Rollback on failure
      setColumns(buildColumns(applications));
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Interview modal handlers
  const handleOpenInterview = (app) => {
    setSelectedApp(app);
    setIsInterviewModalOpen(true);
  };

  const handleScheduleInterviewSubmit = async (interviewData) => {
    try {
      await interviewService.scheduleInterview(interviewData);
      setIsInterviewModalOpen(false);
      fetchApplicants();
      showToast('Interview scheduled & notification sent to candidate!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error scheduling interview', 'error');
    }
  };

  // Stats for header
  const total = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviews = applications.filter((a) => a.status === 'Interview Scheduled').length;
  const selected = applications.filter((a) => a.status === 'Selected').length;

  if (loading) return <Loader text="Loading applicant pipeline..." />;

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <Briefcase size={16} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 600 }}>
              {jobInfo ? (jobInfo.jobTitle + (jobInfo.companyName ? ' \u2014 ' + jobInfo.companyName : '')) : '...'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Applicant Pipeline</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Drag & drop candidates across stages — updates instantly.
          </p>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15,23,42,0.6)', padding: '0.3rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.9rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: viewMode === 'kanban' ? 'rgba(139,92,246,0.25)' : 'transparent',
              color: viewMode === 'kanban' ? '#c084fc' : '#64748b',
            }}
          >
            <LayoutGrid size={14} /> Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.9rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: viewMode === 'list' ? 'rgba(59,130,246,0.25)' : 'transparent',
              color: viewMode === 'list' ? '#60a5fa' : '#64748b',
            }}
          >
            <List size={14} /> List
          </button>
        </div>
      </div>

      {/* ---- Stats Row ---- */}
      <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: total, icon: <Users size={14} />, color: '#60a5fa' },
          { label: 'Shortlisted', value: shortlisted, icon: '⭐', color: '#c084fc' },
          { label: 'Interviews', value: interviews, icon: <Calendar size={14} />, color: '#22d3ee' },
          { label: 'Selected', value: selected, icon: <CheckCircle2 size={14} />, color: '#34d399' },
        ].map((stat) => (
          <div key={stat.label} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '0.6rem 1rem',
            color: stat.color,
          }}>
            <span style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>{stat.icon}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color }}>{stat.value}</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</span>
          </div>
        ))}

        {isUpdating && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.78rem', color: '#fbbf24', animation: 'pulse 1s infinite',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '10px', padding: '0.6rem 1rem',
          }}>
            <Clock size={13} /> Syncing...
          </div>
        )}
      </div>

      {/* ---- Kanban Board View ---- */}
      {viewMode === 'kanban' && (
        applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📋</div>
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.5rem' }}>No applicants yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Candidates who apply for this role will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', paddingBottom: '2rem' }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                minWidth: 'max-content',
                alignItems: 'flex-start',
                paddingBottom: '0.5rem',
              }}>
                {PIPELINE_COLUMNS.map((col) => (
                  <KanbanColumn
                    key={col}
                    columnId={col}
                    applications={columns[col] || []}
                    onScheduleInterview={handleOpenInterview}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        )
      )}

      {/* ---- List View (original flat list, preserved) ---- */}
      {viewMode === 'list' && (
        <div>
          {applications.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No applicants yet for this job.</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Email</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th>Resume</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td style={{ fontWeight: 600 }}>{app.candidate?.name}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{app.candidate?.email}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td>
                          <select
                            className="form-control"
                            value={app.status}
                            onChange={async (e) => {
                              try {
                                await applicationService.updateApplicationStatus(app._id, e.target.value);
                                fetchApplicants();
                                showToast(`Status updated to "${e.target.value}"`);
                              } catch (err) {
                                showToast('Failed to update status', 'error');
                              }
                            }}
                            style={{ width: 'auto', padding: '0.3rem 2rem 0.3rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            {PIPELINE_COLUMNS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          {app.resumeUrl ? (
                            <button
                              type="button"
                              onClick={() => setViewerResume({ url: app.resumeUrl, candidateName: app.candidate?.name })}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <FileText size={13} color="#3b82f6" /> View PDF
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleOpenInterview(app)}
                            className="btn btn-recruiter btn-sm"
                            style={{ fontSize: '0.78rem' }}
                          >
                            <Calendar size={13} /> Interview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interview Modal */}
      {selectedApp && (
        <InterviewModal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          application={selectedApp}
          onSubmit={handleScheduleInterviewSubmit}
        />
      )}

      {/* Resume Viewer Modal */}
      {viewerResume && (
        <ResumeViewerModal
          isOpen={!!viewerResume}
          onClose={() => setViewerResume(null)}
          resumeUrl={viewerResume.url}
          candidateName={viewerResume.candidateName}
        />
      )}

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ApplicantsList;
