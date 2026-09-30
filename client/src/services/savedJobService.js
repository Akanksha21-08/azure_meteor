import API from './api';

export const toggleSaveJob = async (jobId) => {
  const response = await API.post('/saved-jobs/toggle/' + jobId);
  return response.data;
};

export const getSavedJobs = async () => {
  const response = await API.get('/saved-jobs');
  return response.data;
};

export const checkSavedStatus = async (jobId) => {
  const response = await API.get('/saved-jobs/check/' + jobId);
  return response.data;
};
