import api from './client';
import { MESSAGES_PAGE_SIZE } from '../utils/constants';

export const fetchMessages = ({ room, before, limit = MESSAGES_PAGE_SIZE }) =>
  api.get('/messages', { params: { room, before, limit } });

export const sendMessage = ({ text, clientId, room }) =>
  api.post('/messages', { text, clientId, room });

export const fetchUnreadCounts = () => api.get('/messages/unread');
