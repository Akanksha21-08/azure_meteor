import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as jobService from '../../services/jobService';
import { PlusCircle } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    jobTitle: '',
    description: '',
    requiredSkills: '',
    experienceRequired: '1-3 years',
    salaryMin: 80000,
    salaryMax: 120000,
    salaryPeriod: 'Yearly',
    location: '',
    jobType: 'Full Time',
    workMode: 'Remote',
    educationRequirement: 'Bachelor Degree',
    openings: 1
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await jobService.createJob(formData);
      setLoading(false);
      navigate('/recruiter/my-jobs');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error posting job');
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle color="#8b5cf6" /> Post a New Job Opening
        </h1>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input type="text" name="jobTitle" className="form-control" placeholder="e.g. Senior Full Stack Engineer" value={formData.jobTitle} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Job Type *</label>
              <select name="jobType" className="form-control" value={formData.jobType} onChange={handleChange}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label>Work Mode *</label>
              <select name="workMode" className="form-control" value={formData.workMode} onChange={handleChange}>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input type="text" name="location" className="form-control" placeholder="San Francisco, CA or Remote" value={formData.location} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea name="description" className="form-control" rows="5" placeholder="Describe key responsibilities, role expectations, and tech stack details..." value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Required Skills (Comma-separated) *</label>
            <input type="text" name="requiredSkills" className="form-control" placeholder="React.js, Node.js, Express, MongoDB, TypeScript" value={formData.requiredSkills} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Min Salary ($)</label>
              <input type="number" name="salaryMin" className="form-control" value={formData.salaryMin} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Max Salary ($)</label>
              <input type="number" name="salaryMax" className="form-control" value={formData.salaryMax} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Salary Period</label>
              <select name="salaryPeriod" className="form-control" value={formData.salaryPeriod} onChange={handleChange}>
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Experience Level</label>
              <input type="text" name="experienceRequired" className="form-control" placeholder="e.g. 2-4 years" value={formData.experienceRequired} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Education Required</label>
              <input type="text" name="educationRequirement" className="form-control" placeholder="Bachelor Degree" value={formData.educationRequirement} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Openings Count</label>
              <input type="number" name="openings" className="form-control" min="1" value={formData.openings} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => navigate('/recruiter/my-jobs')} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-recruiter">
              {loading ? 'Publishing...' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
