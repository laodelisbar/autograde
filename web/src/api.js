import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-dot-autograde-442112.et.r.appspot.com',
});

export const getData = async (uri) => {
  try {
    const response = await api.get(uri);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default api;