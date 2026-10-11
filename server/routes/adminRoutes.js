const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
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
} = require('../controllers/adminController');

// User report submission (any authenticated user can report fraud)
router.post('/reports/submit', protect, createReport);

// All other routes strictly protected by admin role
router.use(protect);
router.use(authorize('admin'));

// Overview Stats
router.get('/stats', getAdminStats);

// User Management (Kickout / Suspend / Delete / Restore)
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleUserSuspension);
router.delete('/users/:id', deleteUser);

// Company Approvals & Verifications
router.get('/companies', getCompanies);
router.put('/companies/:id/verify', updateCompanyVerification);

// Job Moderation
router.get('/jobs', getJobsForModeration);
router.put('/jobs/:id/moderate', moderateJob);
router.delete('/jobs/:id', deleteJob);

// Fraud & Scam Reports Management
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

module.exports = router;
