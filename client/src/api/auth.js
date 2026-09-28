import api from './client';

export const login = (username) => api.post('/auth/login', { username });

export const getMe = () => api.get('/auth/me');
