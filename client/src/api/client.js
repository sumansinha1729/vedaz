import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getToken } from '../utils/storage';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

let handleUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const { response } = error;

    if (response?.status === 401) handleUnauthorized?.();

    const apiError = new Error(
      response?.data?.error?.message ??
        (response ? 'Something went wrong' : 'Cannot reach the server. Check your connection.'),
    );
    apiError.code = response?.data?.error?.code ?? (response ? 'UNKNOWN_ERROR' : 'NETWORK_ERROR');
    apiError.status = response?.status;
    apiError.details = response?.data?.error?.details;

    return Promise.reject(apiError);
  },
);

export default api;
