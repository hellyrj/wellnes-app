import axiosInstance from './axios';

// Get all moods with optional query parameters
export const getMoods = async (query = {}) => {
  const response = await axiosInstance.get('/moods', { params: query });
  return response.data.data;
};

// Get single mood by ID
export const getMoodById = async (id) => {
  const response = await axiosInstance.get(`/moods/${id}`);
  return response.data.data;
};

// Get mood statistics
export const getMoodStats = async () => {
  const response = await axiosInstance.get('/moods/stats');
  return response.data.data;
};

// Create a new mood
export const createMood = async (data) => {
  const response = await axiosInstance.post('/moods', data);
  return response.data.data;
};

// Update an existing mood
export const updateMood = async (id, data) => {
  const response = await axiosInstance.put(`/moods/${id}`, data);
  return response.data.data;
};

// Delete a mood
export const deleteMood = async (id) => {
  const response = await axiosInstance.delete(`/moods/${id}`);
  return response.data;
};
