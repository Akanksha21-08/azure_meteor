import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as profileService from '../../services/profileService';
import Loader from '../../components/common/Loader';
import { Save, Upload } from 'lucide-react';

const EditCompanyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    industry: '',
    companySize: '100-500',
    website: '',
    location: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    profileService.getRecruiterProfile().then(data => {
      setFormData({
        companyName: data.companyName || '',
        companyDescription: data.companyDescription || '',
        industry: data.industry || '',
        companySize: data.companySize || '100-500',
        website: data.website || '',
        location: data.location || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || ''
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
      await profileService.updateRecruiterProfile(formData);

      if (logoFile) {
        const lData = new FormData();
        lData.append('logo', logoFile);
        await profileService.uploadLogo(lData);
      }

      setSaving(false);
      setMessage('Company profile updated successfully!');
      setTimeout(() => navigate('/recruiter/company-profile'), 1200);
    } catch (err) {
      setSaving(false);
      setMessage(err.response?.data?.message || 'Failed to update company profile');
    }
  };

  if (loading) return <Loader text="Loading company editor..." />;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Company Profile</h1>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Company Name *</label>
              <input type="text" name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <input type="text" name="industry" className="form-control" value={formData.industry} onChange={handleChange} placeholder="e.g. Software & IT Services" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Company Size</label>
              <select name="companySize" className="form-control" value={formData.companySize} onChange={handleChange}>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>

            <div className="form-group">
              <label>Website URL</label>
              <input type="url" name="website" className="form-control" value={formData.website} onChange={handleChange} placeholder="https://company.example.com" />
            </div>

            <div className="form-group">
              <label>Headquarters Location</label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA" />
            </div>
          </div>

          <div className="form-group">
            <label>Company Description / Overview</label>
            <textarea name="companyDescription" className="form-control" rows="4" value={formData.companyDescription} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Recruitment Email</label>
              <input type="email" name="contactEmail" className="form-control" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input type="text" name="contactPhone" className="form-control" value={formData.contactPhone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Upload size={16} /> Upload Company Logo (PNG/JPG)</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="form-control" style={{ padding: '0.4rem' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => navigate('/recruiter/company-profile')} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-recruiter">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Company Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyProfile;
