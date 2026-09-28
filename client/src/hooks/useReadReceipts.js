import { useCallback, useEffect, useRef } from 'react';
import { useSocket } from './useSocket';

const BATCH_DELAY_MS = 500;
const MAX_IDS_PER_EVENT = 100;

export function useReadReceipts(messages, currentUserId) {
  const { socket } = useSocket();
  const reportedRef = useRef({ delivered: new Set(), read: new Set() });
  const pendingRef = useRef({ delivered: new Set(), read: new Set() });
  const timerRef = useRef(null);
  const visibleIdsRef = useRef(new Set());
  const observerRef = useRef(null);

  const flush = useCallback(() => {
    timerRef.current = null;

    for (const type of ['delivered', 'read']) {
      const ids = [...pendingRef.current[type]];
      pendingRef.current[type].clear();

      for (let i = 0; i < ids.length; i += MAX_IDS_PER_EVENT) {
        socket.emit(`message:${type}`, { messageIds: ids.slice(i, i + MAX_IDS_PER_EVENT) });
      }
    }
  }, [socket]);

  // Collect ids for a short moment and send them together in one event
  const queue = useCallback(
    (type, id) => {
      if (reportedRef.current[type].has(id)) return;
      reportedRef.current[type].add(id);
      pendingRef.current[type].add(id);
      timerRef.current ??= setTimeout(flush, BATCH_DELAY_MS);
    },
    [flush],
  );

  const markVisibleAsRead = useCallback(() => {
    if (document.visibilityState !== 'visible') return;
    visibleIdsRef.current.forEach((id) => queue('read', id));
  }, [queue]);

  useEffect(() => {
    for (const message of messages) {
      const fromOther = message._id && message.sender._id !== currentUserId;
      if (fromOther && !message.deliveredTo.includes(currentUserId)) {
        queue('delivered', message._id);
      }
    }
  }, [messages, currentUserId, queue]);

  useEffect(() => {
    document.addEventListener('visibilitychange', markVisibleAsRead);
    return () => {
      document.removeEventListener('visibilitychange', markVisibleAsRead);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        flush();
      }
    };
  }, [markVisibleAsRead, flush]);

  const getObserver = useCallback(() => {
    observerRef.current ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.dataset.messageId;
          if (entry.isIntersecting) visibleIdsRef.current.add(id);
          else visibleIdsRef.current.delete(id);
        }
        markVisibleAsRead();
      },
      { threshold: 0.6 },
    );
    return observerRef.current;
  }, [markVisibleAsRead]);

  // Callback ref for unread messages: watch them until they are seen
  const observeUnread = useCallback(
    (element) => {
      if (!element) return;
      const observer = getObserver();
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        visibleIdsRef.current.delete(element.dataset.messageId);
      };
    },
    [getObserver],
  );

  return { observeUnread };
}
