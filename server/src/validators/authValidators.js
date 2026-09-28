import { z } from 'zod';
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from '../config/constants.js';

export const loginSchema = z.object({
  username: z
    .string({ error: 'Username is required' })
    .trim()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores are allowed')
    .toLowerCase(),
});
