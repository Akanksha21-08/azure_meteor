import API from './api';

export const getPublicJobs = async (params) => {
  const response = await API.get('/jobs', { params });
  return response.data;
};

export const getJobById = async (id) => {
  const response = await API.get('/jobs/' + id);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await API.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await API.put('/jobs/' + id, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await API.delete('/jobs/' + id);
  return response.data;
};

export const toggleJobStatus = async (id) => {
  const response = await API.patch('/jobs/' + id + '/status');
  return response.data;
};

export const getMyJobs = async () => {
  const response = await API.get('/jobs/my-jobs');
  return response.data;
};
