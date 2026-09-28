import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function findOrCreateUser(username) {
  return User.findOneAndUpdate(
    { username },
    { $setOnInsert: { username } },
    { upsert: true, returnDocument: 'after' },
  );
}

export async function getUserById(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return user;
}
