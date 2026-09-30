import API from './api';

export const getCandidateProfile = async () => {
  const response = await API.get('/candidate/profile');
  return response.data;
};

export const updateCandidateProfile = async (data) => {
  const response = await API.put('/candidate/profile', data);
  return response.data;
};

export const uploadResume = async (formData) => {
  const response = await API.post('/candidate/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadPhoto = async (formData) => {
  const response = await API.post('/candidate/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getRecruiterProfile = async () => {
  const response = await API.get('/recruiter/profile');
  return response.data;
};

export const updateRecruiterProfile = async (data) => {
  const response = await API.put('/recruiter/profile', data);
  return response.data;
};

export const uploadLogo = async (formData) => {
  const response = await API.post('/recruiter/upload-logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
