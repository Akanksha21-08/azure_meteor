import API from './api';

export const scheduleInterview = async (data) => {
  const response = await API.post('/interviews/schedule', data);
  return response.data;
};

export const getInterviews = async () => {
  const response = await API.get('/interviews');
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await API.put('/interviews/' + id, data);
  return response.data;
};
