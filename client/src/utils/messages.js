import { isSameDay, minutesBetween } from './date';

const GROUP_GAP_MINUTES = 5;

// clientId exists before the server responds, so it stays stable from "sending" to "sent"
export const messageKey = (message) => message.clientId;

export function upsertMessages(current, incoming) {
  const byKey = new Map(current.map((m) => [messageKey(m), m]));
  for (const message of incoming) {
    byKey.set(messageKey(message), { ...byKey.get(messageKey(message)), ...message });
  }
  return [...byKey.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function getMessageStatus(message, currentUserId) {
  if (message.localStatus) return message.localStatus;
  if (message.readBy.some((id) => id !== currentUserId)) return 'read';
  if (message.deliveredTo.some((id) => id !== currentUserId)) return 'delivered';
  return 'sent';
}

function startsNewGroup(prev, message) {
  return (
    !prev ||
    prev.sender._id !== message.sender._id ||
    !isSameDay(prev.createdAt, message.createdAt) ||
    minutesBetween(prev.createdAt, message.createdAt) > GROUP_GAP_MINUTES
  );
}

// Turns a flat list into date separators + messages with grouping flags
export function buildMessageItems(messages) {
  const items = [];

  messages.forEach((message, index) => {
    const prev = messages[index - 1];
    const next = messages[index + 1];

    if (!prev || !isSameDay(prev.createdAt, message.createdAt)) {
      items.push({ type: 'date', key: `date-${message.createdAt}`, date: message.createdAt });
    }

    items.push({
      type: 'message',
      key: messageKey(message),
      message,
      isFirstInGroup: startsNewGroup(prev, message),
      isLastInGroup: !next || startsNewGroup(message, next),
    });
  });

  return items;
}
