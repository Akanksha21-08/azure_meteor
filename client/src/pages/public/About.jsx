import React from 'react';

const About = () => {
  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="glass-card" style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>About <span className="text-gradient">JobVerse</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          JobVerse is a modern monolithic MERN stack job marketplace platform designed to bridge technical candidates with enterprise recruiters.
        </p>
      </div>
    </div>
  );
};

export default About;
