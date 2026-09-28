import { io } from 'socket.io-client';
import { API_URL } from '../utils/constants';
import { getToken } from '../utils/storage';

const ACK_TIMEOUT_MS = 10000;

export function createSocket() {
  return io(API_URL, {
    autoConnect: false,
    // A function so every reconnect sends the latest token
    auth: (cb) => cb({ token: getToken() }),
  });
}

export async function emitWithAck(socket, event, payload) {
  let response;
  try {
    response = await socket.timeout(ACK_TIMEOUT_MS).emitWithAck(event, payload);
  } catch {
    throw new Error('The server did not respond. Please try again.');
  }

  if (!response.ok) {
    const error = new Error(response.error.message);
    error.code = response.error.code;
    throw error;
  }
  return response.data;
}
