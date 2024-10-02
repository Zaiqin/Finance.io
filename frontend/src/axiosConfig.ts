// src/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthHeader = (user: string) => {
  axiosInstance.defaults.headers.common['user'] = user;
};

export default axiosInstance;