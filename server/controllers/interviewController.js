const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time, mode, meetingLink, location, notes } = req.body;

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this candidate' });
    }

    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      candidate: application.candidate,
      recruiter: req.user._id,
      date,
      time,
      mode: mode || 'Online',
      meetingLink: meetingLink || '',
      location: location || '',
      notes: notes || '',
      status: 'Scheduled'
    });

    application.status = 'Interview Scheduled';
    application.statusHistory.push({ status: 'Interview Scheduled', updatedAt: Date.now() });
    await application.save();

    await Notification.create({
      recipient: application.candidate,
      sender: req.user._id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: 'An interview has been scheduled for "' + application.job.jobTitle + '" on ' + date + ' at ' + time,
      relatedJob: application.job._id,
      relatedApplication: application._id
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviews = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'candidate') {
      query.candidate = req.user._id;
    } else if (req.user.role === 'recruiter') {
      query.recruiter = req.user._id;
    }

    const interviews = await Interview.find(query)
      .sort({ createdAt: -1 })
      .populate('job', 'jobTitle companyName companyLogo location')
      .populate('candidate', 'name email avatar')
      .populate('recruiter', 'name email avatar')
      .populate('application', 'resumeUrl coverLetter');

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('job', 'jobTitle')
      .populate('candidate', 'name');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this interview' });
    }

    const updated = await Interview.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    // Notify the candidate if status has changed to Completed or Cancelled
    const newStatus = req.body.status;
    if (newStatus && ['Completed', 'Cancelled'].includes(newStatus) && newStatus !== interview.status) {
      const msgMap = {
        Completed: `Your interview for "${interview.job?.jobTitle}" has been marked as Completed.`,
        Cancelled:  `Your interview for "${interview.job?.jobTitle}" has been cancelled. The recruiter will reach out soon.`,
      };
      await Notification.create({
        recipient: interview.candidate,
        sender: req.user._id,
        type: 'interview_updated',
        title: `Interview ${newStatus}`,
        message: msgMap[newStatus],
        relatedJob: interview.job?._id,
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scheduleInterview, getInterviews, updateInterview };
