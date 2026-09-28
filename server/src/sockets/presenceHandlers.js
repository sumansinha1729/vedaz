import { DEFAULT_ROOM } from '../config/constants.js';
import { addConnection, removeConnection, getOnlineUserIds } from '../services/presenceService.js';
import { updateLastSeen } from '../services/userService.js';

export function registerPresenceHandlers(io, socket) {
  const { id: userId, username } = socket.data.user;

  const isFirstConnection = addConnection(userId, socket.id);
  socket.emit('presence:init', { onlineUserIds: getOnlineUserIds() });

  if (isFirstConnection) {
    socket.to(DEFAULT_ROOM).emit('presence:update', { userId, username, online: true });
  }

  socket.on('disconnect', async () => {
    const isLastConnection = removeConnection(userId, socket.id);
    if (!isLastConnection) return;

    const lastSeen = new Date();
    io.to(DEFAULT_ROOM).emit('presence:update', { userId, username, online: false, lastSeen });

    try {
      await updateLastSeen(userId, lastSeen);
    } catch (err) {
      console.error('Failed to update lastSeen:', err.message);
    }
  });
}
