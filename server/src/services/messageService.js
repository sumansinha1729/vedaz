import { Message } from '../models/Message.js';
import { AppError } from '../utils/AppError.js';
import { DEFAULT_ROOM } from '../config/constants.js';

const SENDER_FIELDS = 'username';

export async function createMessage({ senderId, text, clientId, room = DEFAULT_ROOM }) {
  try {
    const message = await Message.create({ room, sender: senderId, text, clientId });
    return await message.populate('sender', SENDER_FIELDS);
  } catch (err) {
    // Same clientId sent twice (e.g. a retry): return the already saved message
    if (err.code === 11000) {
      return Message.findOne({ sender: senderId, clientId }).populate('sender', SENDER_FIELDS);
    }
    throw err;
  }
}

export async function getMessages({ before, limit, room = DEFAULT_ROOM }) {
  const filter = { room };

  if (before) {
    const cursor = await Message.findById(before).select('createdAt').lean();
    if (!cursor) throw new AppError('Invalid cursor', 400, 'INVALID_CURSOR');

    filter.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
    ];
  }

  const messages = await Message.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .populate('sender', SENDER_FIELDS)
    .lean();

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();
  messages.reverse();

  return {
    messages,
    hasMore,
    nextCursor: hasMore ? messages[0]._id : null,
  };
}
