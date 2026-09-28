import { DEFAULT_ROOM, TYPING_TIMEOUT_MS } from '../config/constants.js';

export function registerTypingHandlers(socket) {
  const { id: userId, username } = socket.data.user;
  let timer = null;

  const emitTyping = (isTyping) => {
    socket.to(DEFAULT_ROOM).emit('typing:update', { userId, username, isTyping });
  };

  const stopTyping = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    emitTyping(false);
  };

  socket.on('typing:start', () => {
    if (!timer) emitTyping(true);

    // If typing:stop never arrives (e.g. network drop), clear it automatically
    clearTimeout(timer);
    timer = setTimeout(stopTyping, TYPING_TIMEOUT_MS);
  });

  socket.on('typing:stop', stopTyping);
  socket.on('disconnect', stopTyping);
}
