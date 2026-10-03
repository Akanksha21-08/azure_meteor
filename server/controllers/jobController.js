const Job = require('../models/Job');
const RecruiterProfile = require('../models/RecruiterProfile');

const getPublicJobs = async (req, res) => {
  try {
    const {
      search,
      title,
      skills,
      company,
      location,
      jobType,
      workMode,
      experience,
      minSalary,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'active' };

    let isTextSearch = false;
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
      isTextSearch = true;
    }

    if (title) {
      query.jobTitle = { $regex: title, $options: 'i' };
    }

    if (company) {
      query.companyName = { $regex: company, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
      query.requiredSkills = { $in: skillsArray };
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (experience) {
      query.experienceRequired = { $regex: experience, $options: 'i' };
    }

    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'salary-high') sortOptions = { salaryMax: -1 };
    if (sort === 'salary-low') sortOptions = { salaryMin: 1 };
    if (sort === 'relevance' && isTextSearch) sortOptions = { score: { $meta: 'textScore' } };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let total = 0;
    let jobs = [];

    try {
      total = await Job.countDocuments(query);
      const projection = isTextSearch ? { score: { $meta: 'textScore' } } : {};
      jobs = await Job.find(query, projection)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('recruiter', 'name email avatar');
    } catch (err) {
      // Fallback to regex if $text indexing is pending or query contains special chars
      if (isTextSearch) {
        delete query.$text;
        query.$or = [
          { jobTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { requiredSkills: { $in: [new RegExp(search, 'i')] } }
        ];
        total = await Job.countDocuments(query);
        jobs = await Job.find(query)
          .sort(sortOptions === 'relevance' ? { createdAt: -1 } : sortOptions)
          .skip(skip)
          .limit(limitNum)
          .populate('recruiter', 'name email avatar');
      } else {
        throw err;
      }
    }

    res.json({
      jobs,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email avatar');
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const {
      jobTitle,
      description,
      requiredSkills,
      experienceRequired,
      salaryMin,
      salaryMax,
      salaryPeriod,
      location,
      jobType,
      workMode,
      educationRequirement,
      openings,
      deadline
    } = req.body;

    if (!jobTitle || !description || !location || !jobType || !workMode) {
      return res.status(400).json({ message: 'Please provide all required job fields' });
    }

    const job = await Job.create({
      recruiter: req.user._id,
      companyName: recruiterProfile ? recruiterProfile.companyName : req.user.name,
      companyLogo: recruiterProfile ? recruiterProfile.companyLogo : '',
      jobTitle,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      experienceRequired: experienceRequired || '0-1 years',
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      salaryPeriod: salaryPeriod || 'Yearly',
      location,
      jobType,
      workMode,
      educationRequirement: educationRequirement || 'Bachelor Degree',
      openings: openings || 1,
      deadline: deadline || null,
      status: 'active'
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    if (req.body.requiredSkills && typeof req.body.requiredSkills === 'string') {
      req.body.requiredSkills = req.body.requiredSkills.split(',').map(s => s.trim());
    }

    job = await Job.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this job' });
    }

    job.status = job.status === 'active' ? 'closed' : 'active';
    job.updatedAt = Date.now();
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPublicJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getMyJobs
};
