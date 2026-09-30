const RecruiterProfile = require('../models/RecruiterProfile');
const User = require('../models/User');

const getRecruiterProfile = async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user._id }).populate('user', 'name email role avatar');
    if (!profile) {
      profile = await RecruiterProfile.create({ 
        user: req.user._id, 
        companyName: req.user.name + "'s Company" 
      });
      profile = await profile.populate('user', 'name email role avatar');
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecruiterProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyDescription,
      industry,
      companySize,
      website,
      location,
      contactEmail,
      contactPhone,
      socialLinks
    } = req.body;

    let profile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new RecruiterProfile({ user: req.user._id, companyName: companyName || 'Company' });
    }

    if (companyName) profile.companyName = companyName;
    if (companyDescription !== undefined) profile.companyDescription = companyDescription;
    if (industry !== undefined) profile.industry = industry;
    if (companySize !== undefined) profile.companySize = companySize;
    if (website !== undefined) profile.website = website;
    if (location !== undefined) profile.location = location;
    if (contactEmail !== undefined) profile.contactEmail = contactEmail;
    if (contactPhone !== undefined) profile.contactPhone = contactPhone;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;
    profile.updatedAt = Date.now();

    await profile.save();
    const updatedProfile = await RecruiterProfile.findOne({ user: req.user._id }).populate('user', 'name email role avatar');
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image file for logo' });
    }

    const logoUrl = '/uploads/' + req.file.filename;
    let profile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new RecruiterProfile({ user: req.user._id, companyName: 'Company' });
    }

    profile.companyLogo = logoUrl;
    await profile.save();

    res.json({ message: 'Company logo uploaded successfully', companyLogo: logoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecruiterProfile, updateRecruiterProfile, uploadCompanyLogo };
