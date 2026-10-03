import API from './api';

// Dashboard stats
export const getAdminStats = () => API.get('/admin/stats').then(r => r.data);

// Users
export const getAllUsers = (params) => API.get('/admin/users', { params }).then(r => r.data);
export const toggleUserSuspension = (userId, data) => API.put(`/admin/users/${userId}/suspend`, data).then(r => r.data);
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`).then(r => r.data);

// Companies
export const getCompanies = (params) => API.get('/admin/companies', { params }).then(r => r.data);
export const updateCompanyVerification = (companyId, data) => API.put(`/admin/companies/${companyId}/verify`, data).then(r => r.data);

// Jobs
export const getJobsForModeration = (params) => API.get('/admin/jobs', { params }).then(r => r.data);
export const moderateJob = (jobId, data) => API.put(`/admin/jobs/${jobId}/moderate`, data).then(r => r.data);
export const deleteJob = (jobId) => API.delete(`/admin/jobs/${jobId}`).then(r => r.data);

// Reports
export const getReports = (params) => API.get('/admin/reports', { params }).then(r => r.data);
export const resolveReport = (reportId, data) => API.put(`/admin/reports/${reportId}/resolve`, data).then(r => r.data);
