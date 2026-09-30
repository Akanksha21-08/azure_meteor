import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, User, Briefcase, FileCheck, Bookmark, 
  Calendar, Bell, Key, PlusCircle, Building, Users 
} from 'lucide-react';

const Sidebar = () => {
  const { user, isCandidate, isRecruiter } = useContext(AuthContext);
  const location = useLocation();

  const candidateLinks = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/candidate/profile', icon: User },
    { label: 'Applied Jobs', path: '/candidate/applications', icon: FileCheck },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs', icon: Bookmark },
    { label: 'Interviews', path: '/candidate/interviews', icon: Calendar },
    { label: 'Notifications', path: '/candidate/notifications', icon: Bell },
    { label: 'Change Password', path: '/candidate/change-password', icon: Key },
  ];

  const recruiterLinks = [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/recruiter/company-profile', icon: Building },
    { label: 'My Posted Jobs', path: '/recruiter/my-jobs', icon: Briefcase },
    { label: 'Post New Job', path: '/recruiter/create-job', icon: PlusCircle },
    { label: 'Interviews', path: '/recruiter/interviews', icon: Calendar },
    { label: 'Notifications', path: '/recruiter/notifications', icon: Bell },
    { label: 'Change Password', path: '/recruiter/change-password', icon: Key },
  ];

  const links = isCandidate ? candidateLinks : recruiterLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="user-avatar-img" />
        ) : (
          <div className="user-avatar-placeholder">{user?.name ? user.name[0].toUpperCase() : 'U'}</div>
        )}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{user?.name}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            {user?.role} Account
          </span>
        </div>
      </div>

      <ul className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={sidebar-link  }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
