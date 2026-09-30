import API from './api';

export const applyJob = async (jobId, data) => {
  const response = await API.post('/applications/apply/' + jobId, data);
  return response.data;
};

export const getCandidateApplications = async () => {
  const response = await API.get('/applications/candidate');
  return response.data;
};

export const getJobApplicants = async (jobId) => {
  const response = await API.get('/applications/job/' + jobId);
  return response.data;
};

export const getApplicationDetails = async (id) => {
  const response = await API.get('/applications/' + id);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await API.patch('/applications/' + id + '/status', { status });
  return response.data;
};

export const withdrawApplication = async (id) => {
  const response = await API.patch('/applications/' + id + '/withdraw');
  return response.data;
};
