const express = require('express');
const router = express.Router();
const { getPublicJobs, getJobById, createJob, updateJob, deleteJob, toggleJobStatus, getMyJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getPublicJobs);
router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.patch('/:id/status', protect, authorize('recruiter'), toggleJobStatus);

module.exports = router;
