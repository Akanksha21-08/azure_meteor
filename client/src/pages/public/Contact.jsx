import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-container" style={{ maxWidth: '700px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Contact Support</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>Have questions or feedback? Send us a message.</p>

        {submitted ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <h4>Message Sent Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" rows="4" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
