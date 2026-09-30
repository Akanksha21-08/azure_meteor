import React from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--border-color)', padding: '3rem 1.5rem 1.5rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Briefcase color="#3b82f6" size={24} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Job<span style={{ color: '#3b82f6' }}>Verse</span></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Connecting top tech talent with innovative recruiters worldwide. Built on MERN monolithic architecture.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>For Candidates</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/jobs">Browse All Jobs</Link></li>
            <li><Link to="/candidate/dashboard">Candidate Dashboard</Link></li>
            <li><Link to="/candidate/profile">Build Profile & Resume</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>For Recruiters</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/recruiter/create-job">Post a Job</Link></li>
            <li><Link to="/recruiter/dashboard">Recruiter Dashboard</Link></li>
            <li><Link to="/recruiter/company-profile">Company Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Support & Information</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><span>Privacy Policy & Terms</span></li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        &copy; {new Date().getFullYear()} JobVerse Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
