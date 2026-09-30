import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Users, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import * as jobService from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import Loader from '../../components/common/Loader';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    jobService.getPublicJobs({ limit: 6 })
      .then(data => {
        setFeaturedJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/jobs?search=' + encodeURIComponent(search) + '&location=' + encodeURIComponent(location));
  };

  return (
    <div>
      <section style={{ padding: '4rem 1.5rem 5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <TrendingUp size={16} /> Monolithic MERN Job Marketplace Platform
          </span>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Find Your Dream Job or Hire <span className="text-gradient">Top Tech Talent</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Discover thousands of active career opportunities in Software Development, Cloud Architecture, Product Design, and Data Science.
          </p>

          <form onSubmit={handleSearchSubmit} className="glass-card" style={{ padding: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Job title, skills, or keywords..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <MapPin size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="City or Remote..." 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '140px' }}>
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}><Briefcase /></div>
            <div>
              <div className="stat-value">5,000+</div>
              <div className="stat-label">Active Job Openings</div>
            </div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}><Building /></div>
            <div>
              <div className="stat-value">1,200+</div>
              <div className="stat-label">Verified Tech Companies</div>
            </div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}><Users /></div>
            <div>
              <div className="stat-value">45,000+</div>
              <div className="stat-label">Job Seekers Hired</div>
            </div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}><ShieldCheck /></div>
            <div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Verified Postings</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto 5rem', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Latest Job Openings</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Explore high-growth tech positions recently published</p>
          </div>
          <Link to="/jobs" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            View All Jobs <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading featured job listings..." />
        ) : featuredJobs.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No job postings found. Check back soon or run database seed script.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {featuredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto 4rem', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.8))', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>For Job Candidates</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Build your professional developer profile, upload your PDF resume, track your applications live, and book interviews directly with hiring managers.
          </p>
          <Link to="/register" className="btn btn-primary">Create Candidate Account</Link>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(15, 23, 42, 0.8))', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>For Hiring Recruiters</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Publish jobs, filter candidate skills & experience, review cover letters and uploaded resumes, and schedule seamless online or offline interviews.
          </p>
          <Link to="/register" className="btn btn-recruiter">Post Jobs & Hire</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
