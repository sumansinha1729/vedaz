import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { SocketProvider } from '../context/SocketProvider';

export default function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}
