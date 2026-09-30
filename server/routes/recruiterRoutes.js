const express = require('express');
const router = express.Router();
const { getRecruiterProfile, updateRecruiterProfile, uploadCompanyLogo } = require('../controllers/recruiterController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect, authorize('recruiter'));
router.get('/profile', getRecruiterProfile);
router.put('/profile', updateRecruiterProfile);
router.post('/upload-logo', upload.single('logo'), uploadCompanyLogo);

module.exports = router;
