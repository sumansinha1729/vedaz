import { useEffect, useMemo, useState } from 'react';
import { fetchUsers } from '../api/users';
import { useSocket } from './useSocket';
import { useToast } from './useToast';

export function usePresence() {
  const { socket } = useSocket();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [onlineIds, setOnlineIds] = useState(() => new Set());

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data.users))
      .catch(() => showToast("Couldn't load the member list"));
  }, [showToast]);

  useEffect(() => {
    const handleInit = ({ onlineUserIds }) => setOnlineIds(new Set(onlineUserIds));

    const handleUpdate = ({ userId, username, online, lastSeen }) => {
      setOnlineIds((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });

      setUsers((prev) => {
        if (!prev.some((u) => u._id === userId)) {
          return [...prev, { _id: userId, username, lastSeen }];
        }
        if (!lastSeen) return prev;
        return prev.map((u) => (u._id === userId ? { ...u, lastSeen } : u));
      });
    };

    socket.on('presence:init', handleInit);
    socket.on('presence:update', handleUpdate);
    return () => {
      socket.off('presence:init', handleInit);
      socket.off('presence:update', handleUpdate);
    };
  }, [socket]);

  const usersWithStatus = useMemo(
    () =>
      users
        .map((user) => ({ ...user, online: onlineIds.has(user._id) }))
        .sort((a, b) => b.online - a.online || a.username.localeCompare(b.username)),
    [users, onlineIds],
  );

  return { users: usersWithStatus, onlineCount: onlineIds.size };
}
