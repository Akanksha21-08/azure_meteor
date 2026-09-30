import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as jobService from '../../services/jobService';
import * as applicationService from '../../services/applicationService';
import * as profileService from '../../services/profileService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { MapPin, Briefcase, DollarSign, Calendar, Building, Send, FileText, CheckCircle2 } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCandidate, isRecruiter } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    jobService.getJobById(id)
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (isCandidate) {
      profileService.getCandidateProfile()
        .then(p => setCandidateProfile(p))
        .catch(err => console.error(err));
    }
  }, [id, isCandidate]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');

    try {
      await applicationService.applyJob(id, { coverLetter });
      setApplying(false);
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
        navigate('/candidate/applications');
      }, 1500);
    } catch (err) {
      setApplying(false);
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) return <Loader text="Fetching job details..." />;
  if (!job) return <div className="page-container"><p>Job posting not found.</p></div>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.75rem',
              color: '#60a5fa'
            }}>
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
              ) : (
                job.companyName ? job.companyName[0].toUpperCase() : 'C'
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{job.jobTitle}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
                <Building size={18} color="#60a5fa" /> {job.companyName}
              </p>
            </div>
          </div>

          <div>
            {isCandidate ? (
              <button 
                onClick={() => setIsApplyModalOpen(true)} 
                disabled={job.status === 'closed'}
                className="btn btn-primary btn-lg"
              >
                <Send size={18} /> {job.status === 'closed' ? 'Job Closed' : 'Apply Now'}
              </button>
            ) : isRecruiter ? (
              <span className="badge badge-shortlisted">Recruiter View</span>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">Log in to Apply</Link>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={16} color="#60a5fa" /> {job.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Briefcase size={16} color="#a78bfa" /> {job.jobType} &bull; {job.workMode}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><DollarSign size={16} color="#34d399" />  -  / {job.salaryPeriod}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={16} color="#f59e0b" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Job Description</h3>
        <p style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
          {job.description}
        </p>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Required Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {job.requiredSkills?.map((skill, idx) => (
            <span key={idx} style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              color: '#60a5fa',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}>
              {skill}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Experience Required</span>
            <strong style={{ fontSize: '0.95rem' }}>{job.experienceRequired}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Education Level</span>
            <strong style={{ fontSize: '0.95rem' }}>{job.educationRequirement}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Open Positions</span>
            <strong style={{ fontSize: '0.95rem' }}>{job.openings} Openings</strong>
          </div>
        </div>
      </div>

      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title={'Apply for ' + (job ? job.jobTitle : '')}>
        {applySuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Application Submitted!</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Redirecting to your applications list...</p>
          </div>
        ) : (
          <form onSubmit={handleApply}>
            {applyError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                {applyError}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resume Attached from Profile:</span>
              {candidateProfile?.resumeUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem' }}>
                  <FileText size={18} /> {candidateProfile.resumeOriginalName || 'Uploaded Resume.pdf'}
                </div>
              ) : (
                <p style={{ color: '#f87171', fontSize: '0.85rem' }}>
                  No resume found on your profile! Please upload a PDF resume in your Candidate Profile before applying.
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Cover Letter / Pitch to Recruiter (Optional)</label>
              <textarea 
                className="form-control" 
                rows="5" 
                placeholder="Explain why you are a great fit for this position..." 
                value={coverLetter} 
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setIsApplyModalOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button type="submit" disabled={applying || !candidateProfile?.resumeUrl} className="btn btn-primary btn-sm">
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default JobDetails;
