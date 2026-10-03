const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
    email: z.string().trim().email('Invalid email address format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['candidate', 'recruiter'], { 
      errorMap: () => ({ message: 'Role must be either "candidate" or "recruiter"' }) 
    }),
    companyName: z.string().trim().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
