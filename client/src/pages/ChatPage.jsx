import { useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { usePresence } from '../hooks/usePresence';
import Sidebar from '../components/layout/Sidebar';
import ChatHeader from '../components/layout/ChatHeader';
import ConnectionBanner from '../components/layout/ConnectionBanner';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { status } = useSocket();
  const { users, onlineCount } = usePresence();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} users={users} currentUser={user} />

      <div className="flex min-w-0 flex-1 flex-col pt-[env(safe-area-inset-top)]">
        <ChatHeader
          onlineCount={onlineCount}
          connectionStatus={status}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />
        <ConnectionBanner />

        <main className="flex flex-1 items-center justify-center overflow-y-auto p-4 text-sm text-muted">
          Messages will appear here
        </main>
      </div>
    </div>
  );
}
