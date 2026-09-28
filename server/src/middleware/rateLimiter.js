import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';
import { MESSAGE_RATE_LIMIT } from '../config/constants.js';

function createLimiter({ windowMs, limit, message, keyGenerator }) {
  return rateLimit({
    windowMs,
    limit,
    keyGenerator,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => next(new AppError(message, 429, 'RATE_LIMITED')),
  });
}

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: 'Too many login attempts, please try again later',
});

export const messageLimiter = createLimiter({
  ...MESSAGE_RATE_LIMIT,
  message: 'You are sending messages too fast',
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip),
});
