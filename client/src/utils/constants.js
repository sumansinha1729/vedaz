export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const MESSAGE_MAX_LENGTH = 1000;
export const MESSAGES_PAGE_SIZE = 30;
