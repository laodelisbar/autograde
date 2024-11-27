// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = "https://api-dot-autograde-442112.et.r.appspot.com"; // Sesuaikan dengan host dan port Anda

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (username: string, email: string, password: string) => {
  return api.post('/api/register', { username, email, password });
};

export const loginUser = (email: string, password: string) => {
  return api.post('/api/login', { email, password });
};

export const getUserProfile = (token: string) => {
  return api.get('/api/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTests = (token: string) => {
  return api.get('/api/tests', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTest = (token: string, test: any) => {
  return api.post('/api/tests/store', test, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTestById = (token: string, testId: string) => {
  if (!token) {
    return api.get(`/api/tests/show/${testId}`);
  }
  return api.get(`/api/tests/show/${testId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateAcceptResponses = (token: string, testId: string, acceptResponses: boolean) => {
  return api.post('/api/tests/accept-responses', {
    id: testId,
    acceptResponses: acceptResponses,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;