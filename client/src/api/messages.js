import api from './client';
import { MESSAGES_PAGE_SIZE } from '../utils/constants';

export const fetchMessages = ({ before, limit = MESSAGES_PAGE_SIZE } = {}) =>
  api.get('/messages', { params: { before, limit } });

export const sendMessage = ({ text, clientId }) => api.post('/messages', { text, clientId });
