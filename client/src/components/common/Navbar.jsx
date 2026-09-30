import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser, isAuthenticated, isCandidate, isRecruiter } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <Briefcase color="#3b82f6" size={26} />
          <span>Job<span style={{ color: '#3b82f6' }}>Verse</span></span>
          {isCandidate && <span className="brand-badge">Candidate</span>}
          {isRecruiter && <span className="brand-badge" style={{ background: 'rgba(139,92,246,0.2)', color: '#c084fc', borderColor: 'rgba(139,92,246,0.3)' }}>Recruiter</span>}
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          </li>
          <li>
            <Link to="/jobs" className={location.pathname.startsWith('/jobs') ? 'nav-link active' : 'nav-link'}>Browse Jobs</Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>About</Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>Contact</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li><NotificationDropdown /></li>
              <li>
                <Link 
                  to={isCandidate ? '/candidate/dashboard' : '/recruiter/dashboard'} 
                  className={isRecruiter ? 'btn btn-recruiter btn-sm' : 'btn btn-primary btn-sm'}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
                  <LogOut size={16} />
                </button>
              </li>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '1rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
