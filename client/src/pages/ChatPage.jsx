import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function ChatPage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4 p-4">
      <p className="text-lg">
        Logged in as <span className="font-semibold">{user.username}</span>
      </p>
      <Button variant="ghost" onClick={logout}>
        <LogOut className="size-4" aria-hidden="true" />
        Log out
      </Button>
    </main>
  );
}
