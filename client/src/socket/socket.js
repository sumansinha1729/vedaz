import { io } from 'socket.io-client';
import { API_URL } from '../utils/constants';
import { getToken } from '../utils/storage';

export function createSocket() {
  return io(API_URL, {
    autoConnect: false,
    // A function so every reconnect sends the latest token
    auth: (cb) => cb({ token: getToken() }),
  });
}
