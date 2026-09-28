import { useEffect, useMemo, useRef } from 'react';
import { ArrowDown, MessagesSquare, TriangleAlert } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';
import DateSeparator from './DateSeparator';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useChatScroll } from '../../hooks/useChatScroll';
import { useReadReceipts } from '../../hooks/useReadReceipts';
import { buildMessageItems, getMessageStatus } from '../../utils/messages';

const NO_MESSAGES = [];

function CenteredState({ icon, title, children }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-subtle text-muted">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <div className="mt-1 text-sm text-muted">{children}</div>
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  currentUserId,
  status,
  error,
  hasMore,
  loadingOlder,
  olderError,
  onLoadOlder,
  onRetry,
  onRetryMessage,
  isGroup,
  emptyText,
}) {
  const isReady = status === 'ready';
  const { containerRef, handleScroll, scrollToBottom, showJumpButton, newCount } = useChatScroll(
    isReady ? messages : NO_MESSAGES,
    currentUserId,
  );
  const topSentinelRef = useRef(null);
  const items = useMemo(() => buildMessageItems(messages), [messages]);
  const { observeUnread } = useReadReceipts(isReady ? messages : NO_MESSAGES, currentUserId);

  const needsReadReceipt = (message) =>
    message._id && message.sender._id !== currentUserId && !message.readBy.includes(currentUserId);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !hasMore || loadingOlder || olderError) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onLoadOlder(),
      { root: containerRef.current, rootMargin: '200px 0px 0px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingOlder, olderError, onLoadOlder, containerRef]);

  let content;
  if (status === 'loading') {
    content = <MessageSkeleton />;
  } else if (status === 'error') {
    content = (
      <CenteredState icon={<TriangleAlert className="size-6" />} title="Couldn't load messages">
        <p>{error}</p>
        <Button variant="ghost" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      </CenteredState>
    );
  } else if (messages.length === 0) {
    content = (
      <CenteredState icon={<MessagesSquare className="size-6" />} title="No messages yet">
        {emptyText}
      </CenteredState>
    );
  } else {
    content = (
      <>
        <div ref={topSentinelRef} />
        {olderError && (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted">
            Couldn't load older messages.
            <button onClick={onLoadOlder} className="font-medium text-primary hover:underline">
              Retry
            </button>
          </div>
        )}
        {!hasMore && (
          <p className="py-4 text-center text-xs text-muted">This is the start of the conversation</p>
        )}
        {items.map((item) =>
          item.type === 'date' ? (
            <DateSeparator key={item.key} date={item.date} />
          ) : (
            <MessageBubble
              key={item.key}
              message={item.message}
              status={getMessageStatus(item.message, currentUserId)}
              isOwn={item.message.sender._id === currentUserId}
              isFirstInGroup={item.isFirstInGroup}
              isLastInGroup={item.isLastInGroup}
              showSender={isGroup}
              onRetry={onRetryMessage}
              observeRef={needsReadReceipt(item.message) ? observeUnread : undefined}
            />
          ),
        )}
      </>
    );
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Messages"
        aria-busy={status === 'loading' || loadingOlder}
        className="h-full overflow-y-auto overscroll-contain px-3 pb-4 [overflow-anchor:none] sm:px-6"
      >
        {content}
      </div>

      {loadingOlder && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <span className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted shadow-sm">
            <Spinner className="size-3.5" />
            Loading older messages
          </span>
        </div>
      )}

      {isReady && showJumpButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute right-4 bottom-4 flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium shadow-lg transition hover:bg-subtle focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          {newCount > 0 ? `${newCount} new message${newCount > 1 ? 's' : ''}` : 'Latest'}
        </button>
      )}
    </div>
  );
}
