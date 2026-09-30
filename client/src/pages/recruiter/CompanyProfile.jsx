import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as profileService from '../../services/profileService';
import Loader from '../../components/common/Loader';
import { Building, Globe, Mail, Phone, MapPin, Edit, Users, Linkedin, Twitter } from 'lucide-react';

const CompanyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getRecruiterProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading company profile..." />;
  if (!profile) return <p>Company profile not found.</p>;

  const { companyName, companyLogo, companyDescription, industry, companySize, website, location, contactEmail, contactPhone, socialLinks } = profile;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2rem',
              color: '#c084fc'
            }}>
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
              ) : (
                companyName ? companyName[0].toUpperCase() : 'C'
              )}
            </div>

            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{companyName}</h1>
              <p style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.95rem' }}>{industry || 'Technology & Innovation'}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {location}</span>}
                {companySize && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Users size={14} /> {companySize} Employees</span>}
                {website && <a href={website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#60a5fa' }}><Globe size={14} /> Website</a>}
              </div>
            </div>
          </div>

          <Link to="/recruiter/edit-company-profile" className="btn btn-recruiter btn-sm">
            <Edit size={16} /> Edit Company Profile
          </Link>
        </div>

        {companyDescription && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Company Overview</h4>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{companyDescription}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {contactEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={15} color="#60a5fa" /> {contactEmail}</span>}
          {contactPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={15} color="#34d399" /> {contactPhone}</span>}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
