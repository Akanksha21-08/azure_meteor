const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startYear: String,
    endYear: String
  }],
  workExperience: [{
    company: String,
    role: String,
    location: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  projects: [{
    title: String,
    description: String,
    link: String,
    technologies: [{ type: String }]
  }],
  certifications: [{
    title: String,
    issuer: String,
    year: String
  }],
  linkedIn: { type: String, default: '' },
  gitHub: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  expectedSalary: { type: Number, default: 0 },
  preferredJobType: { type: String, enum: ['Full Time', 'Part Time', 'Internship', 'Contract', 'Any'], default: 'Any' },
  preferredLocation: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
