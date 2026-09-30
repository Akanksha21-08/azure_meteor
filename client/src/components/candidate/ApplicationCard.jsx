import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { Building, MapPin, Calendar, Eye, Ban } from 'lucide-react';

const ApplicationCard = ({ application, onWithdraw }) => {
  const { _id, job, status, appliedAt } = application;

  return (
    <div className="glass-card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <Link to={'/jobs/' + job?._id}>{job?.jobTitle || 'Job Title'}</Link>
            </h3>
            <StatusBadge status={status} />
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={15} color="#60a5fa" /> {job?.companyName}
            <span>&bull;</span>
            <MapPin size={15} color="#a78bfa" /> {job?.location}
          </p>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} /> Applied on {new Date(appliedAt).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={'/candidate/applications/' + _id} className="btn btn-outline btn-sm">
            <Eye size={15} /> Details
          </Link>
          {status !== 'Withdrawn' && status !== 'Rejected' && status !== 'Selected' && (
            <button onClick={() => onWithdraw(_id)} className="btn btn-danger btn-sm">
              <Ban size={15} /> Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
