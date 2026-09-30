import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as profileService from '../../services/profileService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { Upload, Save } from 'lucide-react';

const CandidateEditProfile = () => {
  const navigate = useNavigate();
  const { updateUserState } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    linkedIn: '',
    gitHub: '',
    portfolio: '',
    expectedSalary: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    profileService.getCandidateProfile().then(data => {
      setFormData({
        name: data.user?.name || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        linkedIn: data.linkedIn || '',
        gitHub: data.gitHub || '',
        portfolio: data.portfolio || '',
        expectedSalary: data.expectedSalary || ''
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await profileService.updateCandidateProfile(formData);
      if (formData.name) updateUserState({ name: formData.name });

      if (resumeFile) {
        const rData = new FormData();
        rData.append('resume', resumeFile);
        await profileService.uploadResume(rData);
      }

      if (photoFile) {
        const pData = new FormData();
        pData.append('photo', photoFile);
        const resPhoto = await profileService.uploadPhoto(pData);
        if (resPhoto.photoUrl) updateUserState({ avatar: resPhoto.photoUrl });
      }

      setSaving(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/candidate/profile'), 1200);
    } catch (err) {
      setSaving(false);
      setMessage(err.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) return <Loader text="Fetching profile editor..." />;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Candidate Profile</h1>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Current Location</label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Expected Salary ($ / Year)</label>
              <input type="number" name="expectedSalary" className="form-control" value={formData.expectedSalary} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Bio / Summary</label>
            <textarea name="bio" className="form-control" rows="3" value={formData.bio} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Skills (Comma-separated)</label>
            <input type="text" name="skills" className="form-control" value={formData.skills} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input type="url" name="linkedIn" className="form-control" value={formData.linkedIn} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input type="url" name="gitHub" className="form-control" value={formData.gitHub} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Portfolio URL</label>
              <input type="url" name="portfolio" className="form-control" value={formData.portfolio} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Upload size={16} /> Upload Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="form-control" style={{ padding: '0.4rem' }} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Upload size={16} /> Upload Resume PDF</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="form-control" style={{ padding: '0.4rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/candidate/profile')} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateEditProfile;
