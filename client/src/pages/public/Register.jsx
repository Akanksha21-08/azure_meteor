import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, User, Building } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const { registerUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await registerUser({ name, email, password, role, companyName });
    if (result.success) {
      if (role === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)' }}>
      <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Briefcase size={36} color="#3b82f6" style={{ margin: '0 auto 0.75rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join JobVerse as a Job Candidate or Hiring Recruiter</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button 
              type="button" 
              className={role === 'candidate' ? 'btn btn-primary' : 'btn btn-outline'}
              onClick={() => setRole('candidate')}
            >
              <User size={16} /> Candidate
            </button>
            <button 
              type="button" 
              className={role === 'recruiter' ? 'btn btn-recruiter' : 'btn btn-outline'}
              onClick={() => setRole('recruiter')}
            >
              <Building size={16} /> Recruiter
            </button>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Alex Johnson" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {role === 'recruiter' && (
            <div className="form-group">
              <label>Company Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="TechCorp Innovations" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="alex@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="At least 6 characters" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={role === 'recruiter' ? 'btn btn-recruiter' : 'btn btn-primary'} 
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already registered? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
