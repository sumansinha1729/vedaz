import { useEffect, useMemo, useState } from 'react';
import { SocketContext } from './SocketContext';
import { createSocket } from '../socket/socket';
import { useAuth } from '../hooks/useAuth';

export function SocketProvider({ children }) {
  const { logout } = useAuth();
  const [socket] = useState(createSocket);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const lostStatus = () => (navigator.onLine ? 'reconnecting' : 'offline');

    const handleConnect = () => setStatus('connected');

    const handleDisconnect = (reason) => {
      // The server closed the connection (e.g. a restart); socket.io won't retry on its own
      if (reason === 'io server disconnect') socket.connect();
      setStatus(lostStatus());
    };

    const handleConnectError = () => {
      // Not retrying means the server rejected our token
      if (!socket.active) {
        logout();
        return;
      }
      setStatus(lostStatus());
    };

    const handleOffline = () => setStatus('offline');
    const handleOnline = () => setStatus(socket.connected ? 'connected' : 'reconnecting');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      socket.disconnect();
    };
  }, [socket, logout]);

  const value = useMemo(() => ({ socket, status }), [socket, status]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
