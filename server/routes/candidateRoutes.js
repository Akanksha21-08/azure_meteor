const express = require('express');
const router = express.Router();
const { getCandidateProfile, updateCandidateProfile, uploadResume, uploadPhoto } = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect, authorize('candidate'));
router.get('/profile', getCandidateProfile);
router.put('/profile', updateCandidateProfile);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);

module.exports = router;
