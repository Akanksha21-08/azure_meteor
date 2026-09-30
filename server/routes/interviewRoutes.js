const express = require('express');
const router = express.Router();
const { scheduleInterview, getInterviews, updateInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/schedule', protect, authorize('recruiter'), scheduleInterview);
router.get('/', protect, getInterviews);
router.put('/:id', protect, authorize('recruiter'), updateInterview);

module.exports = router;
