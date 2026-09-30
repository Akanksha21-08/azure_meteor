const User = require('./models/User');
const CandidateProfile = require('./models/CandidateProfile');
const RecruiterProfile = require('./models/RecruiterProfile');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');

const autoSeed = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) return;

    console.log('Seeding initial test data (Candidate & Recruiter)...');

    // 1. Create Recruiter User
    const recruiterUser = await User.create({
      name: 'Sarah Miller',
      email: 'recruiter@example.com',
      password: 'password123',
      role: 'recruiter'
    });

    const recruiterProfile = await RecruiterProfile.create({
      user: recruiterUser._id,
      companyName: 'TechCorp Innovations',
      companyDescription: 'TechCorp Innovations is a global cloud software company powering next-gen enterprise solutions.',
      industry: 'Information Technology',
      companySize: '100-500',
      website: 'https://techcorp.example.com',
      location: 'San Francisco, CA',
      contactEmail: 'careers@techcorp.example.com',
      contactPhone: '+1 (555) 019-2834',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp'
      }
    });

    // 2. Create Candidate User
    const candidateUser = await User.create({
      name: 'Alex Johnson',
      email: 'candidate@example.com',
      password: 'password123',
      role: 'candidate'
    });

    const candidateProfile = await CandidateProfile.create({
      user: candidateUser._id,
      phone: '+1 (555) 349-8120',
      location: 'New York, NY',
      bio: 'Passionate Full Stack Developer with 4 years of experience crafting modern web applications using React, Node.js, and MongoDB.',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git'],
      education: [
        {
          institution: 'State University of New York',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startYear: '2018',
          endYear: '2022'
        }
      ],
      workExperience: [
        {
          company: 'WebSphere Labs',
          role: 'Frontend Developer',
          location: 'New York, NY',
          startDate: '2022-06',
          endDate: 'Present',
          description: 'Built high-performance React dashboard components, reduced page load times by 40%, and collaborated with product teams.'
        }
      ],
      projects: [
        {
          title: 'DevPulse Analytics Platform',
          description: 'A developer metrics aggregation tool built with MERN stack.',
          link: 'https://github.com/alexjohnson/devpulse',
          technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind']
        }
      ],
      certifications: [
        {
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          year: '2023'
        }
      ],
      linkedIn: 'https://linkedin.com/in/alexjohnson-dev',
      gitHub: 'https://github.com/alexjohnson-dev',
      portfolio: 'https://alexjohnson.dev',
      expectedSalary: 110000,
      preferredJobType: 'Full Time',
      preferredLocation: 'Remote',
      resumeUrl: '/uploads/sample-resume.pdf',
      resumeOriginalName: 'Alex_Johnson_Resume.pdf'
    });

    // 3. Create Sample Jobs
    const job1 = await Job.create({
      recruiter: recruiterUser._id,
      companyName: recruiterProfile.companyName,
      companyLogo: '',
      jobTitle: 'Senior Full Stack MERN Developer',
      description: 'We are seeking a talented Senior Full Stack Developer to lead our Web Applications squad. You will design, develop, and maintain high-throughput web applications using React, Node.js, Express, and MongoDB.',
      requiredSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'TypeScript'],
      experienceRequired: '3-5 years',
      salaryMin: 120000,
      salaryMax: 150000,
      salaryPeriod: 'Yearly',
      location: 'San Francisco, CA',
      jobType: 'Full Time',
      workMode: 'Remote',
      educationRequirement: 'Bachelor Degree in CS',
      openings: 2,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const job2 = await Job.create({
      recruiter: recruiterUser._id,
      companyName: recruiterProfile.companyName,
      companyLogo: '',
      jobTitle: 'Frontend React UI Engineer',
      description: 'Join our design system and frontend team to craft responsive, visually stunning web experiences. Deep proficiency in React components, state management, and modern CSS is required.',
      requiredSkills: ['React.js', 'JavaScript', 'CSS3', 'Tailwind CSS', 'Redux / Context API'],
      experienceRequired: '1-3 years',
      salaryMin: 90000,
      salaryMax: 115000,
      salaryPeriod: 'Yearly',
      location: 'New York, NY',
      jobType: 'Full Time',
      workMode: 'Hybrid',
      educationRequirement: 'Bachelor Degree',
      openings: 3,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const job3 = await Job.create({
      recruiter: recruiterUser._id,
      companyName: recruiterProfile.companyName,
      companyLogo: '',
      jobTitle: 'Backend Node.js API Specialist',
      description: 'Looking for a Node.js backend developer to design micro-services and scalable RESTful API endpoints with MongoDB integration, JWT security, and file processing.',
      requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Multer'],
      experienceRequired: '2-4 years',
      salaryMin: 105000,
      salaryMax: 130000,
      salaryPeriod: 'Yearly',
      location: 'Austin, TX',
      jobType: 'Contract',
      workMode: 'Remote',
      educationRequirement: 'Bachelor Degree',
      openings: 1,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // 4. Create Application
    const application = await Application.create({
      job: job1._id,
      candidate: candidateUser._id,
      recruiter: recruiterUser._id,
      resumeUrl: candidateProfile.resumeUrl,
      coverLetter: 'Dear Hiring Team at TechCorp, I am excited to apply for the Senior Full Stack MERN Developer role. With 4 years of hands-on experience building scalable MERN web applications, I am confident in delivering high-value software for your team.',
      status: 'Shortlisted',
      statusHistory: [
        { status: 'Applied', updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { status: 'Under Review', updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { status: 'Shortlisted', updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ],
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // 5. Create Saved Job
    await SavedJob.create({
      candidate: candidateUser._id,
      job: job2._id
    });

    // 6. Create Interview
    await Interview.create({
      application: application._id,
      job: job1._id,
      candidate: candidateUser._id,
      recruiter: recruiterUser._id,
      date: '2026-09-02',
      time: '14:00 PM EST',
      mode: 'Online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Technical discussion focusing on React state architecture and Node.js REST API security.',
      status: 'Scheduled'
    });

    // 7. Create Notifications
    await Notification.create({
      recipient: candidateUser._id,
      sender: recruiterUser._id,
      type: 'status_updated',
      title: 'Application Shortlisted!',
      message: 'Great news! Your application for Senior Full Stack MERN Developer at TechCorp Innovations has been Shortlisted.',
      relatedJob: job1._id,
      relatedApplication: application._id,
      read: false
    });

    await Notification.create({
      recipient: candidateUser._id,
      sender: recruiterUser._id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: 'TechCorp Innovations scheduled an interview for Senior Full Stack MERN Developer on 2026-09-02 at 14:00 PM EST.',
      relatedJob: job1._id,
      relatedApplication: application._id,
      read: false
    });

    console.log('--- TEST ACCOUNTS CREATED ---');
    console.log('Candidate: candidate@example.com / password123');
    console.log('Recruiter: recruiter@example.com / password123');
  } catch (err) {
    console.error('Error auto-seeding data:', err);
  }
};

module.exports = autoSeed;
