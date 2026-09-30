const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');

// @desc    Get candidate profile
// @route   GET /api/candidate/profile
// @access  Private (Candidate)
const getCandidateProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email role avatar');
    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
      profile = await profile.populate('user', 'name email role avatar');
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidate/profile
// @access  Private (Candidate)
const updateCandidateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      bio,
      skills,
      education,
      workExperience,
      projects,
      certifications,
      linkedIn,
      gitHub,
      portfolio,
      expectedSalary,
      preferredJobType,
      preferredLocation
    } = req.body;

    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (education !== undefined) profile.education = education;
    if (workExperience !== undefined) profile.workExperience = workExperience;
    if (projects !== undefined) profile.projects = projects;
    if (certifications !== undefined) profile.certifications = certifications;
    if (linkedIn !== undefined) profile.linkedIn = linkedIn;
    if (gitHub !== undefined) profile.gitHub = gitHub;
    if (portfolio !== undefined) profile.portfolio = portfolio;
    if (expectedSalary !== undefined) profile.expectedSalary = expectedSalary;
    if (preferredJobType !== undefined) profile.preferredJobType = preferredJobType;
    if (preferredLocation !== undefined) profile.preferredLocation = preferredLocation;
    profile.updatedAt = Date.now();

    await profile.save();
    const updatedProfile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email role avatar');
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload candidate resume
// @route   POST /api/candidate/upload-resume
// @access  Private (Candidate)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select a resume file to upload' });
    }

    const fileUrl = /uploads/;
    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    profile.resumeUrl = fileUrl;
    profile.resumeOriginalName = req.file.originalname;
    await profile.save();

    res.json({ 
      message: 'Resume uploaded successfully', 
      resumeUrl: fileUrl, 
      resumeOriginalName: req.file.originalname 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload candidate photo
// @route   POST /api/candidate/upload-photo
// @access  Private (Candidate)
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image file to upload' });
    }

    const photoUrl = /uploads/;
    await User.findByIdAndUpdate(req.user._id, { avatar: photoUrl });
    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (profile) {
      profile.profilePhoto = photoUrl;
      await profile.save();
    }

    res.json({ message: 'Profile photo uploaded successfully', photoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCandidateProfile, updateCandidateProfile, uploadResume, uploadPhoto };
