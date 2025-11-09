// apiToken.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { getToken } from './AuthService';

const apiToken = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
},
});

apiToken.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {        
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiToken;