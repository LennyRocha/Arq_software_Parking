import axios from 'axios';
import { API_URL } from '@env';
import { Session } from '../modules/acceso/hooks/TokenManagement';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const expired = await Session.isExpired();
  if (expired) {
    await Session.clearSession();
    throw new Error('TOKEN_EXPIRED');
  }
  const token = await Session.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;