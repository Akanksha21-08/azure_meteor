const { z } = require('zod');

const createJobSchema = z.object({
  body: z.object({
    jobTitle: z.string().trim().min(3, 'Job title must be at least 3 characters'),
    description: z.string().trim().min(10, 'Description must be at least 10 characters'),
    location: z.string().trim().min(2, 'Location is required'),
    jobType: z.enum(['Full Time', 'Part Time', 'Internship', 'Contract'], {
      errorMap: () => ({ message: 'Invalid job type' })
    }),
    workMode: z.enum(['Remote', 'Hybrid', 'Onsite'], {
      errorMap: () => ({ message: 'Invalid work mode' })
    }),
    requiredSkills: z.union([z.array(z.string()), z.string()]).optional(),
    experienceRequired: z.string().optional(),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    salaryPeriod: z.string().optional(),
    educationRequirement: z.string().optional(),
    openings: z.coerce.number().optional(),
    deadline: z.string().optional(),
  }),
});

module.exports = {
  createJobSchema,
};
