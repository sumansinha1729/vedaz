import { verifyToken } from '../utils/jwt.js';

export function socketAuth(socket, next) {
  const { token } = socket.handshake.auth;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const payload = verifyToken(token);
    socket.data.user = { id: payload.sub, username: payload.username };
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
}
