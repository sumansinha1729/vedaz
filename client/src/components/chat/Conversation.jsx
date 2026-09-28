import { useMessages } from '../../hooks/useMessages';
import { useTyping } from '../../hooks/useTyping';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import Composer from './Composer';

export default function Conversation({ room, currentUserId, isGroup, placeholder, emptyText }) {
  const chat = useMessages(room);
  const { typingUsers, notifyTyping, stopTyping } = useTyping(room);

  return (
    <>
      <MessageList
        messages={chat.messages}
        currentUserId={currentUserId}
        status={chat.status}
        error={chat.error}
        hasMore={chat.hasMore}
        loadingOlder={chat.loadingOlder}
        olderError={chat.olderError}
        onLoadOlder={chat.loadOlder}
        onRetry={chat.reloadHistory}
        onRetryMessage={chat.retryMessage}
        isGroup={isGroup}
        emptyText={emptyText}
      />
      <TypingIndicator users={typingUsers} />
      <Composer
        placeholder={placeholder}
        onSend={chat.sendMessage}
        onTyping={notifyTyping}
        onStopTyping={stopTyping}
      />
    </>
  );
}
