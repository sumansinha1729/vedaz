// userId -> Set of socket ids, so a user with several tabs stays online until the last one closes
const onlineUsers = new Map();

export function addConnection(userId, socketId) {
  const sockets = onlineUsers.get(userId) ?? new Set();
  const isFirstConnection = sockets.size === 0;

  sockets.add(socketId);
  onlineUsers.set(userId, sockets);
  return isFirstConnection;
}

export function removeConnection(userId, socketId) {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return false;

  sockets.delete(socketId);
  if (sockets.size > 0) return false;

  onlineUsers.delete(userId);
  return true;
}

export function getOnlineUserIds() {
  return [...onlineUsers.keys()];
}
