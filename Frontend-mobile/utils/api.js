import axios from 'axios';
import { API_URL } from '@env'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("")

export default api;