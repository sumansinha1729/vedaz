export const DEFAULT_ROOM = 'general';
export const userRoom = (userId) => `user:${userId}`;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export const MESSAGE_MAX_LENGTH = 1000;
export const MESSAGE_RATE_LIMIT = { limit: 30, windowMs: 60 * 1000 };
