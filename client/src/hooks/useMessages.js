import { useCallback, useEffect, useReducer, useRef } from 'react';
import { fetchMessages } from '../api/messages';
import { upsertMessages } from '../utils/messages';
import { useSocket } from './useSocket';

const initialState = {
  messages: [],
  status: 'loading',
  error: null,
  hasMore: false,
  nextCursor: null,
  loadingOlder: false,
  olderError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'HISTORY_REQUESTED':
      return { ...state, status: 'loading', error: null };
    case 'HISTORY_LOADED':
      return {
        ...state,
        status: 'ready',
        messages: upsertMessages(state.messages, action.messages),
        hasMore: action.hasMore,
        nextCursor: action.nextCursor,
      };
    case 'HISTORY_FAILED':
      return { ...state, status: 'error', error: action.error };
    case 'OLDER_REQUESTED':
      return { ...state, loadingOlder: true, olderError: null };
    case 'OLDER_LOADED':
      return {
        ...state,
        loadingOlder: false,
        messages: upsertMessages(state.messages, action.messages),
        hasMore: action.hasMore,
        nextCursor: action.nextCursor,
      };
    case 'OLDER_FAILED':
      return { ...state, loadingOlder: false, olderError: action.error };
    case 'MESSAGES_RECEIVED':
      return { ...state, messages: upsertMessages(state.messages, action.messages) };
    default:
      return state;
  }
}

export function useMessages() {
  const { socket } = useSocket();
  const [state, dispatch] = useReducer(reducer, initialState);
  const loadingOlderRef = useRef(false);

  const loadHistory = useCallback(async () => {
    dispatch({ type: 'HISTORY_REQUESTED' });
    try {
      const data = await fetchMessages();
      dispatch({ type: 'HISTORY_LOADED', ...data });
    } catch (err) {
      dispatch({ type: 'HISTORY_FAILED', error: err.message });
    }
  }, []);

  const loadOlder = useCallback(async () => {
    if (loadingOlderRef.current || !state.hasMore) return;
    loadingOlderRef.current = true;
    dispatch({ type: 'OLDER_REQUESTED' });

    try {
      const data = await fetchMessages({ before: state.nextCursor });
      dispatch({ type: 'OLDER_LOADED', ...data });
    } catch (err) {
      dispatch({ type: 'OLDER_FAILED', error: err.message });
    } finally {
      loadingOlderRef.current = false;
    }
  }, [state.hasMore, state.nextCursor]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    let hasConnectedBefore = socket.connected;

    const handleNewMessage = ({ message }) => {
      dispatch({ type: 'MESSAGES_RECEIVED', messages: [message] });
    };

    // After a reconnect, fetch the latest page to fill in anything we missed
    const handleConnect = async () => {
      if (!hasConnectedBefore) {
        hasConnectedBefore = true;
        return;
      }
      try {
        const data = await fetchMessages();
        dispatch({ type: 'MESSAGES_RECEIVED', messages: data.messages });
      } catch {}
    };

    socket.on('message:new', handleNewMessage);
    socket.on('connect', handleConnect);
    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('connect', handleConnect);
    };
  }, [socket]);

  return { ...state, loadOlder, reloadHistory: loadHistory };
}
