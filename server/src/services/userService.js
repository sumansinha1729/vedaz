import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function findOrCreateUser(username) {
  return User.findOneAndUpdate(
    { username },
    { $setOnInsert: { username } },
    { upsert: true, returnDocument: 'after' },
  );
}

export async function listUsers() {
  return User.find().sort({ username: 1 }).lean();
}

export async function updateLastSeen(userId, lastSeen) {
  await User.updateOne({ _id: userId }, { lastSeen });
}

export async function getUserById(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return user;
}
