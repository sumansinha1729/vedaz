import { sendMessageSchema } from '../validators/messageValidators.js';
import { createMessage } from '../services/messageService.js';
import { AppError } from '../utils/AppError.js';
import { MESSAGE_RATE_LIMIT } from '../config/constants.js';
import { withAck } from './withAck.js';

function createRateLimiter({ limit, windowMs }) {
  let count = 0;
  let windowStart = Date.now();

  return () => {
    const now = Date.now();
    if (now - windowStart > windowMs) {
      windowStart = now;
      count = 0;
    }
    count += 1;
    return count <= limit;
  };
}

export function registerMessageHandlers(socket) {
  const { id: userId } = socket.data.user;
  const isAllowed = createRateLimiter(MESSAGE_RATE_LIMIT);

  socket.on(
    'message:send',
    withAck(async (payload) => {
      if (!isAllowed()) {
        throw new AppError('You are sending messages too fast', 429, 'RATE_LIMITED');
      }

      const { text, clientId } = sendMessageSchema.parse(payload);
      const message = await createMessage({ senderId: userId, text, clientId });
      return { message };
    }),
  );
}
