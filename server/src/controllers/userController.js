import { listUsers } from '../services/userService.js';

export async function getUsers(req, res) {
  const users = await listUsers();
  res.json({ success: true, data: { users } });
}
