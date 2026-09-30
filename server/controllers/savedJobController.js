const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

const toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user._id;

    const existing = await SavedJob.findOne({ candidate: candidateId, job: jobId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ isSaved: false, message: 'Job removed from saved list' });
    } else {
      await SavedJob.create({ candidate: candidateId, job: jobId });
      return res.json({ isSaved: true, message: 'Job saved successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ candidate: req.user._id })
      .sort({ savedAt: -1 })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'name email avatar' }
      });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkSavedStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const existing = await SavedJob.findOne({ candidate: req.user._id, job: jobId });
    res.json({ isSaved: !!existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleSaveJob, getSavedJobs, checkSavedStatus };
