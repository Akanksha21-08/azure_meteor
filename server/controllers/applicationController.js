const Application = require('../models/Application');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const Notification = require('../models/Notification');

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, customResumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ message: 'This job posting is closed and no longer accepting applications' });
    }

    const existingApplication = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const candidateProfile = await CandidateProfile.findOne({ user: req.user._id });
    const resumeUrl = customResumeUrl || (candidateProfile ? candidateProfile.resumeUrl : '');

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume in your profile or attach one before applying' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      recruiter: job.recruiter,
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'Applied',
      statusHistory: [{ status: 'Applied', updatedAt: Date.now() }]
    });

    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      type: 'application_submitted',
      title: 'New Job Application',
      message: req.user.name + ' applied for "' + job.jobTitle + '"',
      relatedJob: jobId,
      relatedApplication: application._id
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .sort({ appliedAt: -1 })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'name email avatar' }
      });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .sort({ appliedAt: -1 })
      .populate('candidate', 'name email avatar')
      .populate('job', 'jobTitle companyName');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicationDetails = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email avatar')
      .populate('job')
      .populate('recruiter', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const isCandidate = application.candidate._id.toString() === req.user._id.toString();
    const isRecruiter = application.recruiter._id.toString() === req.user._id.toString();

    if (!isCandidate && !isRecruiter) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    const candidateProfile = await CandidateProfile.findOne({ user: application.candidate._id });

    res.json({
      application,
      candidateProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid application status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update status for this application' });
    }

    application.status = status;
    application.statusHistory.push({ status, updatedAt: Date.now() });
    await application.save();

    await Notification.create({
      recipient: application.candidate,
      sender: req.user._id,
      type: 'status_updated',
      title: 'Application Status Updated',
      message: 'Your application status for "' + application.job.jobTitle + '" was updated to "' + status + '"',
      relatedJob: application.job._id,
      relatedApplication: application._id
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    application.status = 'Withdrawn';
    application.statusHistory.push({ status: 'Withdrawn', updatedAt: Date.now() });
    await application.save();

    await Notification.create({
      recipient: application.recruiter,
      sender: req.user._id,
      type: 'application_withdrawn',
      title: 'Application Withdrawn',
      message: req.user.name + ' withdrew their application for "' + application.job.jobTitle + '"',
      relatedJob: application.job._id,
      relatedApplication: application._id
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getCandidateApplications,
  getJobApplicants,
  getApplicationDetails,
  updateApplicationStatus,
  withdrawApplication
};
