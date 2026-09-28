import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import Button from '../components/ui/Button';
import ConnectionBanner from '../components/layout/ConnectionBanner';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { status } = useSocket();

  return (
    <div className="flex h-dvh flex-col">
      <ConnectionBanner />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg">
          Logged in as <span className="font-semibold">{user.username}</span>
        </p>
        <p className="text-sm text-muted">Socket: {status}</p>
        <Button variant="ghost" onClick={logout}>
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </Button>
      </main>
    </div>
  );
}
