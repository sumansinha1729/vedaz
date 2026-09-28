import api from './client';

export const fetchUsers = () => api.get('/users');
