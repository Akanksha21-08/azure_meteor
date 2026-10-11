const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

// @desc    Get dashboard metrics & overview
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalCompanies,
      pendingCompanies,
      totalJobs,
      activeJobs,
      flaggedJobs,
      pendingReports,
      totalReports,
      suspendedUsers,
      recentUsers,
      recentReports
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      RecruiterProfile.countDocuments(),
      RecruiterProfile.countDocuments({ verificationStatus: 'pending' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'flagged' }),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments(),
      User.countDocuments({ isSuspended: true }),
      User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).limit(5).select('-password'),
      Report.find().sort({ createdAt: -1 }).limit(5).populate('reporter', 'name email')
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalCompanies,
        pendingCompanies,
        totalJobs,
        activeJobs,
        flaggedJobs,
        pendingReports,
        totalReports,
        suspendedUsers
      },
      recentUsers,
      recentReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with search, role & suspension filters
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query = { role: { $ne: 'admin' } };

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'suspended') {
      query.isSuspended = true;
    } else if (status === 'active') {
      query.isSuspended = false;
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-password'),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend or unsuspend a user (kick out / restore access)
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
const toggleUserSuspension = async (req, res) => {
  try {
    const { isSuspended, reason = '' } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot suspend administrator accounts' });
    }

    user.isSuspended = Boolean(isSuspended);
    user.suspensionReason = user.isSuspended ? (reason || 'Violation of platform terms of service') : '';
    await user.save();

    // If recruiter was suspended, flag all their active jobs to protect candidates
    if (user.role === 'recruiter') {
      if (user.isSuspended) {
        await Job.updateMany(
          { recruiter: user._id, status: 'active' },
          { status: 'flagged', moderationNotes: 'Auto-flagged: Recruiter account suspended' }
        );
        await RecruiterProfile.findOneAndUpdate(
          { user: user._id },
          { verificationStatus: 'suspended', verificationNotes: reason || 'Suspended by admin' }
        );
      } else {
        // Restored
        await Job.updateMany(
          { recruiter: user._id, status: 'flagged' },
          { status: 'active', moderationNotes: 'Restored: Recruiter account reactivated' }
        );
      }
    }

    // Send in-app notification to the user
    await Notification.create({
      recipient: user._id,
      sender: req.user._id,
      type: 'account_status',
      title: user.isSuspended ? 'Account Suspended' : 'Account Access Restored',
      message: user.isSuspended 
        ? `Your account has been suspended: ${user.suspensionReason}`
        : 'Your account access has been restored by the administration team.'
    });

    res.json({
      message: user.isSuspended ? 'User has been suspended' : 'User access restored',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
        suspensionReason: user.suspensionReason
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete a user & associated data
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete administrator accounts' });
    }

    // Cascade delete user data
    if (user.role === 'candidate') {
      await CandidateProfile.deleteOne({ user: user._id });
      await Application.deleteMany({ candidate: user._id });
    } else if (user.role === 'recruiter') {
      await RecruiterProfile.deleteOne({ user: user._id });
      await Job.deleteMany({ recruiter: user._id });
      await Application.deleteMany({ recruiter: user._id });
    }

    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and all associated data permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies with verification status
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getCompanies = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.verificationStatus = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { companyName: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
        { industry: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const companies = await RecruiterProfile.find(query)
      .populate('user', 'name email avatar isSuspended createdAt')
      .sort({ updatedAt: -1 });

    // Attach active job count per company
    const enhanced = await Promise.all(
      companies.map(async (c) => {
        const jobCount = await Job.countDocuments({ recruiter: c.user?._id });
        return {
          ...c.toObject(),
          jobCount
        };
      })
    );

    res.json(enhanced);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company verification status (Approve / Reject / Suspend)
// @route   PUT /api/admin/companies/:id/verify
// @access  Private (Admin)
const updateCompanyVerification = async (req, res) => {
  try {
    const { status, notes = '' } = req.body;
    const validStatuses = ['pending', 'verified', 'rejected', 'suspended'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const profile = await RecruiterProfile.findById(req.params.id).populate('user');
    if (!profile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    profile.verificationStatus = status;
    profile.verificationNotes = notes;
    if (status === 'verified') {
      profile.verifiedAt = new Date();
    }
    await profile.save();

    // Notify recruiter
    if (profile.user?._id) {
      await Notification.create({
        recipient: profile.user._id,
        sender: req.user._id,
        type: 'company_verification',
        title: `Company Verification: ${status.toUpperCase()}`,
        message: status === 'verified'
          ? `Congratulations! "${profile.companyName}" has been verified by the JobVerse admin team.`
          : `Update regarding "${profile.companyName}": Status set to ${status}. ${notes ? 'Note: ' + notes : ''}`
      });
    }

    res.json({
      message: `Company status updated to ${status}`,
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs for moderation (with status filter)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getJobsForModeration = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { jobTitle: { $regex: search.trim(), $options: 'i' } },
        { companyName: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('recruiter', 'name email isSuspended')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query)
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Moderate job (approve, flag, reject, close)
// @route   PUT /api/admin/jobs/:id/moderate
// @access  Private (Admin)
const moderateJob = async (req, res) => {
  try {
    const { status, notes = '' } = req.body;
    const validStatuses = ['active', 'closed', 'flagged', 'rejected', 'pending_review'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid job status' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.status = status;
    job.moderationNotes = notes;
    job.updatedAt = new Date();
    await job.save();

    // Notify job author
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      type: 'job_moderation',
      title: `Job Listing Moderation: ${job.jobTitle}`,
      message: `Your job listing status has been set to "${status}". ${notes ? 'Notes: ' + notes : ''}`
    });

    res.json({
      message: `Job status updated to ${status}`,
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job permanently
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Application.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(job._id);

    res.json({ message: 'Job listing and applications removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all fraud/abuse reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res) => {
  try {
    const { status, targetType } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve or dismiss a report + optional automated enforcement
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private (Admin)
const resolveReport = async (req, res) => {
  try {
    const { status, adminNotes = '', action = 'none' } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status || 'resolved';
    report.adminNotes = adminNotes;
    report.actionTaken = action;
    report.resolvedAt = new Date();
    await report.save();

    // Automated action execution if requested
    if (action === 'user_suspended' && report.targetType === 'user') {
      await User.findByIdAndUpdate(report.targetId, {
        isSuspended: true,
        suspensionReason: `Suspended following verified report: ${report.reason}`
      });
    } else if (action === 'job_removed' && report.targetType === 'job') {
      await Job.findByIdAndUpdate(report.targetId, {
        status: 'flagged',
        moderationNotes: `Flagged following verified report: ${report.reason}`
      });
    }

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a fraud or scam report (Candidates/Recruiters)
// @route   POST /api/reports
// @access  Private (Authenticated)
const createReport = async (req, res) => {
  try {
    const { targetType, targetId, targetTitle = '', reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: 'Target, target ID, and reason are required' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      targetTitle,
      reason,
      details: details || '',
      status: 'pending'
    });

    res.status(201).json({
      message: 'Report submitted. Our moderation team will investigate promptly.',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserSuspension,
  deleteUser,
  getCompanies,
  updateCompanyVerification,
  getJobsForModeration,
  moderateJob,
  deleteJob,
  getReports,
  resolveReport,
  createReport
};
