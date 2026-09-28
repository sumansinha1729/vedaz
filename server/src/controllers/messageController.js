import { sendMessageSchema, getMessagesSchema } from '../validators/messageValidators.js';
import { createMessage, getMessages } from '../services/messageService.js';

export async function listMessages(req, res) {
  const { before, limit } = getMessagesSchema.parse(req.query);
  const result = await getMessages({ before, limit });

  res.json({ success: true, data: result });
}

export async function sendMessage(req, res) {
  const { text, clientId } = sendMessageSchema.parse(req.body);
  const message = await createMessage({ senderId: req.user.id, text, clientId });

  res.status(201).json({ success: true, data: { message } });
}
