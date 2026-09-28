import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));

  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected');
}

export function disconnectDB() {
  return mongoose.disconnect();
}
