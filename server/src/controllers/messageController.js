import { sendMessageSchema, getMessagesSchema } from '../validators/messageValidators.js';
import { createMessage, getMessages, getUnreadCounts } from '../services/messageService.js';

export async function listMessages(req, res) {
  const { room, before, limit } = getMessagesSchema.parse(req.query);
  const result = await getMessages({ userId: req.user.id, room, before, limit });

  res.json({ success: true, data: result });
}

export async function sendMessage(req, res) {
  const { text, clientId, room } = sendMessageSchema.parse(req.body);
  const message = await createMessage({ senderId: req.user.id, text, clientId, room });

  res.status(201).json({ success: true, data: { message } });
}

export async function unreadCounts(req, res) {
  const counts = await getUnreadCounts(req.user.id);
  res.json({ success: true, data: { counts } });
}
