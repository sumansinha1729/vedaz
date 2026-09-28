import { useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { usePresence } from '../hooks/usePresence';
import { useMessages } from '../hooks/useMessages';
import Sidebar from '../components/layout/Sidebar';
import ChatHeader from '../components/layout/ChatHeader';
import ConnectionBanner from '../components/layout/ConnectionBanner';
import MessageList from '../components/chat/MessageList';

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { status } = useSocket();
  const { users, onlineCount } = usePresence();
  const chat = useMessages();
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

        <MessageList
          messages={chat.messages}
          currentUserId={user._id}
          status={chat.status}
          error={chat.error}
          hasMore={chat.hasMore}
          loadingOlder={chat.loadingOlder}
          olderError={chat.olderError}
          onLoadOlder={chat.loadOlder}
          onRetry={chat.reloadHistory}
        />
      </div>
    </div>
  );
}
