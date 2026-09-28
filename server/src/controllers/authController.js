import { loginSchema } from '../validators/authValidators.js';
import { findOrCreateUser, getUserById } from '../services/userService.js';
import { signToken } from '../utils/jwt.js';

export async function login(req, res) {
  const { username } = loginSchema.parse(req.body);
  const user = await findOrCreateUser(username);
  const token = signToken(user);

  res.json({ success: true, data: { token, user } });
}

export async function getMe(req, res) {
  const user = await getUserById(req.user.id);
  res.json({ success: true, data: { user } });
}
