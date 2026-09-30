import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as profileService from '../../services/profileService';
import Loader from '../../components/common/Loader';
import { User, Mail, Phone, MapPin, FileText, Linkedin, Github, Globe, Edit, Briefcase, GraduationCap } from 'lucide-react';

const CandidateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getCandidateProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading candidate profile..." />;
  if (!profile) return <p>Profile not found.</p>;

  const { user, phone, location, bio, skills, education, workExperience, linkedIn, gitHub, portfolio, resumeUrl, resumeOriginalName } = profile;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
            ) : (
              <div className="user-avatar-placeholder" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                {user?.name ? user.name[0].toUpperCase() : 'C'}
              </div>
            )}

            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.name}</h1>
              <p style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.95rem' }}>Candidate</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={14} /> {user?.email}</span>
                {phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} /> {phone}</span>}
                {location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {location}</span>}
              </div>
            </div>
          </div>

          <Link to="/candidate/edit-profile" className="btn btn-primary btn-sm">
            <Edit size={16} /> Edit Profile
          </Link>
        </div>

        {bio && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>About Bio</h4>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{bio}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          {linkedIn && <a href={linkedIn} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Linkedin size={15} color="#60a5fa" /> LinkedIn</a>}
          {gitHub && <a href={gitHub} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Github size={15} color="#f472b6" /> GitHub</a>}
          {portfolio && <a href={portfolio} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Globe size={15} color="#34d399" /> Portfolio</a>}
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText color="#3b82f6" /> Resume PDF
        </h3>
        {resumeUrl ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontWeight: 600, color: '#60a5fa' }}>{resumeOriginalName || 'Candidate Resume.pdf'}</span>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">View Resume PDF</a>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No resume uploaded yet. Click Edit Profile to upload your resume.</p>
        )}
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Skills</h3>
        {skills && skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No skills added.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
