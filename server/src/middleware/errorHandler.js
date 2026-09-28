import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

// Express identifies error handlers by their 4 arguments
export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong';
  let details;

  if (err instanceof AppError) {
    ({ statusCode, code, message, details } = err);
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request data';
    details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Request body is not valid JSON';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'Request body is too large';
  }

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    error: { code, message, ...(details && { details }) },
  });
}
