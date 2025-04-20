import axios from 'axios';

// create a single axios instance configured with the backend URL & timeout
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 5000,
});

export default api;
