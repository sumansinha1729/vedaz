import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { messageKey } from '../utils/messages';

const NEAR_BOTTOM_PX = 120;

export function useChatScroll(messages, currentUserId) {
  const containerRef = useRef(null);
  const snapshotRef = useRef(null);
  const lastKeyRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [seenKey, setSeenKey] = useState(null);

  const lastKey = messages.length ? messageKey(messages.at(-1)) : null;

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
    setIsNearBottom(nearBottom);
    if (nearBottom) setSeenKey(lastKeyRef.current);
  }, []);

  useLayoutEffect(() => {
    lastKeyRef.current = lastKey;
    const el = containerRef.current;
    if (!el || messages.length === 0) return;

    const firstKey = messageKey(messages[0]);
    const prev = snapshotRef.current;

    if (!prev) {
      el.scrollTop = el.scrollHeight;
    } else if (firstKey !== prev.firstKey && lastKey === prev.lastKey) {
      // Older messages were added on top: keep the same messages in view
      el.scrollTop += el.scrollHeight - prev.scrollHeight;
    } else if (lastKey !== prev.lastKey) {
      const isMine = messages.at(-1).sender._id === currentUserId;
      if (isMine || isNearBottom) scrollToBottom();
    }

    snapshotRef.current = { firstKey, lastKey, scrollHeight: el.scrollHeight };
  }, [messages, lastKey, currentUserId, isNearBottom, scrollToBottom]);

  const seenIndex = messages.findIndex((m) => messageKey(m) === seenKey);
  const newCount = seenIndex === -1 ? 0 : messages.length - 1 - seenIndex;

  return {
    containerRef,
    handleScroll,
    scrollToBottom,
    showJumpButton: !isNearBottom,
    newCount,
  };
}
