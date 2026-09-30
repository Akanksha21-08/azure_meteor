import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s) {
      case 'Applied': return 'badge-applied';
      case 'Under Review': return 'badge-review';
      case 'Shortlisted': return 'badge-shortlisted';
      case 'Interview Scheduled': return 'badge-interview';
      case 'Selected': return 'badge-selected';
      case 'Rejected': return 'badge-rejected';
      case 'Withdrawn': return 'badge-withdrawn';
      case 'active': return 'badge-active';
      case 'closed': return 'badge-closed';
      default: return 'badge-applied';
    }
  };

  return (
    <span className={'badge ' + getBadgeClass(status)}>
      {status}
    </span>
  );
};

export default StatusBadge;
