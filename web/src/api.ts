// src/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Sesuaikan dengan host dan port Anda

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

export const getTestById = (testId: string) => {
    return api.get(`/api/tests/${testId}`);
};

export const startTest = (data: { testId: string, username?: string }) => {
  const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Create the request body
  const requestBody: { testId: string, username?: string } = { testId: data.testId };
  if (data.username) {
    requestBody.username = data.username;
  }
  console.log('Request Body: ',requestBody);

  return api.post('/api/tests/start', requestBody, { headers });
};

export const showCreatedTest = (token: string, testId: string) => {
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

export const submitTest = (payload: { userTestId: string, questions: { questionId: string, answer: string }[] }) => {
  return api.post('/api/tests/submit', payload);
};

export default api;