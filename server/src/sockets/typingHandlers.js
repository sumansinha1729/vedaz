import { DEFAULT_ROOM, TYPING_TIMEOUT_MS } from '../config/constants.js';
import { canAccessRoom, roomTargets } from '../utils/rooms.js';

export function registerTypingHandlers(socket) {
  const { id: userId, username } = socket.data.user;
  const timers = new Map();

  const emitTyping = (room, isTyping) => {
    socket.to(roomTargets(room)).emit('typing:update', { userId, username, room, isTyping });
  };

  const stopTyping = (room) => {
    if (!timers.has(room)) return;
    clearTimeout(timers.get(room));
    timers.delete(room);
    emitTyping(room, false);
  };

  socket.on('typing:start', (payload) => {
    const room = payload?.room ?? DEFAULT_ROOM;
    if (!canAccessRoom(room, userId)) return;

    if (!timers.has(room)) emitTyping(room, true);

    // If typing:stop never arrives (e.g. network drop), clear it automatically
    clearTimeout(timers.get(room));
    timers.set(
      room,
      setTimeout(() => stopTyping(room), TYPING_TIMEOUT_MS),
    );
  });

  socket.on('typing:stop', (payload) => stopTyping(payload?.room ?? DEFAULT_ROOM));
  socket.on('disconnect', () => [...timers.keys()].forEach(stopTyping));
}
