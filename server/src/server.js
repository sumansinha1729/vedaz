import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${env.PORT} is already in use`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
