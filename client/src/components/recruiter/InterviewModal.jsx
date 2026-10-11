import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const EMPTY_FORM = {
  date: '',
  time: '',
  mode: 'Online',
  meetingLink: '',
  location: '',
  notes: '',
};

const InterviewModal = ({ isOpen, onClose, application, onSubmit }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Reset form whenever the modal opens for a new candidate
  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
    }
  }, [isOpen, application?._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert('Please fill in date and time');
      return;
    }
    onSubmit({
      applicationId: application._id,
      ...formData
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Schedule Interview - ' + (application?.candidate?.name || 'Candidate')}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Interview Date *</label>
            <input 
              type="date" 
              name="date" 
              className="form-control" 
              value={formData.date} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Interview Time *</label>
            <input 
              type="text" 
              name="time" 
              placeholder="e.g. 14:00 PM EST" 
              className="form-control" 
              value={formData.time} 
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Interview Mode *</label>
          <select name="mode" className="form-control" value={formData.mode} onChange={handleChange}>
            <option value="Online">Online (Video Call)</option>
            <option value="Offline">Offline (In-Person Office)</option>
          </select>
        </div>

        {formData.mode === 'Online' ? (
          <div className="form-group">
            <label>Meeting Link (Google Meet / Zoom)</label>
            <input 
              type="url" 
              name="meetingLink" 
              placeholder="https://meet.google.com/xyz-abc-def" 
              className="form-control" 
              value={formData.meetingLink} 
              onChange={handleChange} 
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Office Address / Location</label>
            <input 
              type="text" 
              name="location" 
              placeholder="123 Tech Blvd, Suite 400" 
              className="form-control" 
              value={formData.location} 
              onChange={handleChange} 
            />
          </div>
        )}

        <div className="form-group">
          <label>Notes / Instructions for Candidate</label>
          <textarea 
            name="notes" 
            placeholder="Please prepare system design background and portfolio code samples..." 
            className="form-control" 
            value={formData.notes} 
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
          <button type="submit" className="btn btn-recruiter btn-sm">Confirm Schedule</button>
        </div>
      </form>
    </Modal>
  );
};

export default InterviewModal;
