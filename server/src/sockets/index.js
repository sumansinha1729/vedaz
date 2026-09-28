import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { DEFAULT_ROOM, userRoom } from '../config/constants.js';
import { socketAuth } from './socketAuth.js';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    const { id: userId, username } = socket.data.user;

    socket.join(DEFAULT_ROOM);
    socket.join(userRoom(userId));
    console.log(`Socket connected: ${username} (${socket.id})`);

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${username} (${socket.id}) - ${reason}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
}
