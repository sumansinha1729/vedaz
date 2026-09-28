import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError('Invalid or expired token', 401, 'UNAUTHORIZED');
  }

  req.user = { id: payload.sub, username: payload.username };
  next();
}
