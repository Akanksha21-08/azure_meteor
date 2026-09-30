const express = require('express');
const router = express.Router();
const { toggleSaveJob, getSavedJobs, checkSavedStatus } = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('candidate'));
router.post('/toggle/:jobId', toggleSaveJob);
router.get('/', getSavedJobs);
router.get('/check/:jobId', checkSavedStatus);

module.exports = router;
