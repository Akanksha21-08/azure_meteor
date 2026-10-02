const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  jobTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  experienceRequired: { type: String, default: '0-1 years' },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  salaryPeriod: { type: String, default: 'Yearly' },
  location: { type: String, required: true },
  jobType: { type: String, enum: ['Full Time', 'Part Time', 'Internship', 'Contract'], required: true },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'], required: true },
  educationRequirement: { type: String, default: 'Bachelor Degree' },
  openings: { type: Number, default: 1 },
  deadline: { type: Date },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Full-text compound index for high-speed indexed search across key fields
jobSchema.index(
  {
    jobTitle: 'text',
    description: 'text',
    requiredSkills: 'text',
    companyName: 'text',
    location: 'text'
  },
  {
    weights: {
      jobTitle: 10,
      requiredSkills: 6,
      companyName: 4,
      location: 3,
      description: 1
    },
    name: 'JobTextSearchIndex'
  }
);

module.exports = mongoose.model('Job', jobSchema);
