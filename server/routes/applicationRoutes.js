const express = require('express');
const router = express.Router();
const { applyJob, getCandidateApplications, getJobApplicants, getApplicationDetails, updateApplicationStatus, withdrawApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/apply/:jobId', protect, authorize('candidate'), applyJob);
router.get('/candidate', protect, authorize('candidate'), getCandidateApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.get('/:id', protect, getApplicationDetails);
router.patch('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);
router.patch('/:id/withdraw', protect, authorize('candidate'), withdrawApplication);

module.exports = router;
