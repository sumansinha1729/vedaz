import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';

const START_THROTTLE_MS = 2000;
const IDLE_TIMEOUT_MS = 3000;

export function useTyping() {
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState([]);
  const isTypingRef = useRef(false);
  const lastStartRef = useRef(0);
  const idleTimerRef = useRef(null);

  // volatile: dropped instead of queued while offline, so no stale events are sent later
  const stopTyping = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    socket.volatile.emit('typing:stop');
  }, [socket]);

  const notifyTyping = useCallback(() => {
    const now = Date.now();
    if (!isTypingRef.current || now - lastStartRef.current > START_THROTTLE_MS) {
      socket.volatile.emit('typing:start');
      isTypingRef.current = true;
      lastStartRef.current = now;
    }

    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(stopTyping, IDLE_TIMEOUT_MS);
  }, [socket, stopTyping]);

  useEffect(() => {
    const handleUpdate = ({ userId, username, isTyping }) => {
      setTypingUsers((prev) => {
        const others = prev.filter((u) => u.userId !== userId);
        return isTyping ? [...others, { userId, username }] : others;
      });
    };
    const clearAll = () => setTypingUsers([]);

    socket.on('typing:update', handleUpdate);
    socket.on('disconnect', clearAll);
    return () => {
      socket.off('typing:update', handleUpdate);
      socket.off('disconnect', clearAll);
      stopTyping();
    };
  }, [socket, stopTyping]);

  return { typingUsers, notifyTyping, stopTyping };
}
