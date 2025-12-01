import axios from 'axios';
import { API_URL } from '@env';
import { Session } from '../modules/acceso/hooks/TokenManagement';
import { showExpiredAlertCallback } from '../context/GlobalContext';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await Session.getToken();

  if (!token) return config;

  const expired = await Session.isExpired();

  if (expired) {
    console.warn("⚠️ Token expirado. No se agrega Authorization.");
    showExpiredAlertCallback();
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;