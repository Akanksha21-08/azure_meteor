const express = require('express');
const router = express.Router();
const { getPublicJobs, getJobById, createJob, updateJob, deleteJob, toggleJobStatus, getMyJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const validate = require('../middleware/validateMiddleware');
const { createJobSchema } = require('../validators/jobValidator');

router.get('/', getPublicJobs);
router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter'), validate(createJobSchema), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.patch('/:id/status', protect, authorize('recruiter'), toggleJobStatus);

module.exports = router;
