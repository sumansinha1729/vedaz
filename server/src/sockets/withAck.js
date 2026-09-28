import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

function toSocketError(err) {
  if (err instanceof AppError) {
    return { code: err.code, message: err.message };
  }
  if (err instanceof ZodError) {
    return { code: 'VALIDATION_ERROR', message: err.issues[0].message };
  }
  console.error(err);
  return { code: 'INTERNAL_ERROR', message: 'Something went wrong' };
}

export function withAck(handler) {
  return async (payload, ack) => {
    const reply = typeof ack === 'function' ? ack : () => {};

    try {
      const data = await handler(payload);
      reply({ ok: true, data });
    } catch (err) {
      reply({ ok: false, error: toSocketError(err) });
    }
  };
}
