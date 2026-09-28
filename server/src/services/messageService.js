import { Message } from '../models/Message.js';
import { AppError } from '../utils/AppError.js';
import { DEFAULT_ROOM, userRoom } from '../config/constants.js';
import { getIO } from '../sockets/index.js';

const SENDER_FIELDS = 'username';

async function saveMessage({ senderId, text, clientId, room }) {
  try {
    const message = await Message.create({ room, sender: senderId, text, clientId });
    await message.populate('sender', SENDER_FIELDS);
    return message.toObject();
  } catch (err) {
    // Same clientId sent twice (e.g. a retry): return the already saved message
    if (err.code === 11000) {
      return Message.findOne({ sender: senderId, clientId })
        .populate('sender', SENDER_FIELDS)
        .lean();
    }
    throw err;
  }
}

export async function createMessage({ senderId, text, clientId, room = DEFAULT_ROOM }) {
  const message = await saveMessage({ senderId, text, clientId, room });
  getIO().to(room).emit('message:new', { message });
  return message;
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

export async function markMessages({ messageIds, userId, status }) {
  const field = status === 'read' ? 'readBy' : 'deliveredTo';

  const pending = await Message.find({
    _id: { $in: messageIds },
    sender: { $ne: userId },
    [field]: { $ne: userId },
  })
    .select('_id')
    .lean();

  if (pending.length === 0) return 0;

  const ids = pending.map((m) => m._id);
  // A read message is always delivered too
  const update =
    status === 'read'
      ? { $addToSet: { readBy: userId, deliveredTo: userId } }
      : { $addToSet: { deliveredTo: userId } };

  await Message.updateMany({ _id: { $in: ids } }, update);

  const updated = await Message.find({ _id: { $in: ids } })
    .select('sender deliveredTo readBy')
    .lean();
  notifySenders(updated);

  return updated.length;
}

function notifySenders(messages) {
  const updatesBySender = new Map();

  for (const { _id, sender, deliveredTo, readBy } of messages) {
    const senderId = sender.toString();
    if (!updatesBySender.has(senderId)) updatesBySender.set(senderId, []);
    updatesBySender.get(senderId).push({ messageId: _id, deliveredTo, readBy });
  }

  for (const [senderId, updates] of updatesBySender) {
    getIO().to(userRoom(senderId)).emit('message:status', { updates });
  }
}
