import { useCallback, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Hash } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { usePresence } from '../hooks/usePresence';
import { useUnreadCounts } from '../hooks/useUnreadCounts';
import Sidebar from '../components/layout/Sidebar';
import ChatHeader from '../components/layout/ChatHeader';
import ConnectionBanner from '../components/layout/ConnectionBanner';
import Conversation from '../components/chat/Conversation';
import Avatar from '../components/ui/Avatar';
import { GENERAL_ROOM, dmRoomId } from '../utils/rooms';
import { formatLastSeen } from '../utils/date';
import { ROOM_NAME } from '../utils/constants';

function getConversationDetails(partnerId, users, onlineCount) {
  if (!partnerId) {
    return {
      icon: (
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-subtle text-muted">
          <Hash className="size-5" aria-hidden="true" />
        </div>
      ),
      title: ROOM_NAME,
      subtitle: `${onlineCount} online`,
      subtitleActive: true,
      placeholder: `Message #${ROOM_NAME}`,
      emptyText: 'Say hi and start the conversation.',
    };
  }

  const partner = users.find((u) => u._id === partnerId);
  const name = partner?.username ?? 'Direct message';

  return {
    icon: <Avatar name={name} online={partner?.online} />,
    title: name,
    subtitle: partner?.online ? 'Online' : formatLastSeen(partner?.lastSeen),
    subtitleActive: Boolean(partner?.online),
    placeholder: `Message ${name}`,
    emptyText: `This is the beginning of your conversation with ${name}.`,
  };
}

export default function ChatPage() {
  const { userId: partnerId } = useParams();
  const { user, logout } = useAuth();
  const { status } = useSocket();
  const { users, onlineCount } = usePresence();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const room = partnerId ? dmRoomId(user._id, partnerId) : GENERAL_ROOM;
  const { getCount, totalElsewhere } = useUnreadCounts(room, user._id);
  const details = getConversationDetails(partnerId, users, onlineCount);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (partnerId === user._id) return <Navigate to="/" replace />;

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        users={users}
        currentUser={user}
        activeRoom={room}
        getUnreadCount={getCount}
      />

      <div className="flex min-w-0 flex-1 flex-col pt-[env(safe-area-inset-top)]">
        <ChatHeader
          icon={details.icon}
          title={details.title}
          subtitle={details.subtitle}
          subtitleActive={details.subtitleActive}
          connectionStatus={status}
          hasUnreadElsewhere={totalElsewhere > 0}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />
        <ConnectionBanner />

        <Conversation
          key={room}
          room={room}
          currentUserId={user._id}
          isGroup={!partnerId}
          placeholder={details.placeholder}
          emptyText={details.emptyText}
        />
      </div>
    </div>
  );
}
