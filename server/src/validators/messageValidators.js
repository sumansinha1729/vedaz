import { z } from 'zod';
import { DEFAULT_ROOM, MESSAGE_MAX_LENGTH } from '../config/constants.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid message id');

export const roomSchema = z
  .string()
  .regex(/^(general|dm:[a-f\d]{24}:[a-f\d]{24})$/, 'Invalid conversation')
  .default(DEFAULT_ROOM);

export const sendMessageSchema = z.object({
  text: z
    .string({ error: 'Message text is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(MESSAGE_MAX_LENGTH, `Message must be at most ${MESSAGE_MAX_LENGTH} characters`),
  clientId: z.uuid('clientId must be a valid UUID'),
  room: roomSchema,
});

export const getMessagesSchema = z.object({
  room: roomSchema,
  before: objectId.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(30),
});

export const messageIdsSchema = z.object({
  messageIds: z.array(objectId).min(1).max(100),
});
