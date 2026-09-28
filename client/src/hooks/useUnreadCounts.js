import { useEffect, useRef, useState } from 'react';
import { fetchUnreadCounts } from '../api/messages';
import { useSocket } from './useSocket';
import { useToast } from './useToast';

export function useUnreadCounts(activeRoom, currentUserId) {
  const { socket } = useSocket();
  const { showToast } = useToast();
  const [counts, setCounts] = useState({});
  const [previousRoom, setPreviousRoom] = useState(activeRoom);
  const activeRoomRef = useRef(activeRoom);

  // Opening a conversation (or leaving it) means its messages have been seen
  if (previousRoom !== activeRoom) {
    setPreviousRoom(activeRoom);
    setCounts((prev) => ({ ...prev, [previousRoom]: 0, [activeRoom]: 0 }));
  }

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    fetchUnreadCounts()
      .then((data) => setCounts(data.counts))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleNewMessage = ({ message }) => {
      if (message.room === activeRoomRef.current || message.sender._id === currentUserId) return;

      setCounts((prev) => ({ ...prev, [message.room]: (prev[message.room] ?? 0) + 1 }));
      if (message.room.startsWith('dm:')) {
        showToast(`New message from ${message.sender.username}`, 'info');
      }
    };

    socket.on('message:new', handleNewMessage);
    return () => socket.off('message:new', handleNewMessage);
  }, [socket, currentUserId, showToast]);

  const getCount = (room) => (room === activeRoom ? 0 : (counts[room] ?? 0));
  const totalElsewhere = Object.keys(counts).reduce((sum, room) => sum + getCount(room), 0);

  return { getCount, totalElsewhere };
}
