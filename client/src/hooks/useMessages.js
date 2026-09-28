import { useCallback, useEffect, useReducer, useRef } from 'react';
import { fetchMessages, sendMessage as sendMessageRequest } from '../api/messages';
import { emitWithAck } from '../socket/socket';
import { upsertMessages } from '../utils/messages';
import { useAuth } from './useAuth';
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

// Messages from the server are saved, so any local "sending"/"failed" flag no longer applies
const markSaved = (messages) => messages.map((m) => ({ ...m, localStatus: undefined, error: undefined }));

function reducer(state, action) {
  switch (action.type) {
    case 'HISTORY_REQUESTED':
      return { ...state, status: 'loading', error: null };
    case 'HISTORY_LOADED':
      return {
        ...state,
        status: 'ready',
        messages: upsertMessages(state.messages, markSaved(action.messages)),
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
        messages: upsertMessages(state.messages, markSaved(action.messages)),
        hasMore: action.hasMore,
        nextCursor: action.nextCursor,
      };
    case 'OLDER_FAILED':
      return { ...state, loadingOlder: false, olderError: action.error };
    case 'MESSAGES_RECEIVED':
      return { ...state, messages: upsertMessages(state.messages, markSaved(action.messages)) };
    case 'MESSAGE_SENDING':
      return { ...state, messages: upsertMessages(state.messages, [action.message]) };
    case 'MESSAGE_FAILED':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.clientId === action.clientId && !m._id
            ? { ...m, localStatus: 'failed', error: action.error }
            : m,
        ),
      };
    default:
      return state;
  }
}

export function useMessages() {
  const { user } = useAuth();
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

  const deliver = useCallback(
    async ({ text, clientId }) => {
      try {
        const { message } = socket.connected
          ? await emitWithAck(socket, 'message:send', { text, clientId })
          : await sendMessageRequest({ text, clientId });
        dispatch({ type: 'MESSAGES_RECEIVED', messages: [message] });
      } catch (err) {
        dispatch({ type: 'MESSAGE_FAILED', clientId, error: err.message });
      }
    },
    [socket],
  );

  const sendMessage = useCallback(
    (text) => {
      const message = {
        clientId: crypto.randomUUID(),
        text,
        sender: { _id: user._id, username: user.username },
        createdAt: new Date().toISOString(),
        deliveredTo: [],
        readBy: [],
        localStatus: 'sending',
      };
      dispatch({ type: 'MESSAGE_SENDING', message });
      deliver(message);
    },
    [user, deliver],
  );

  // Retries reuse the same clientId, so the server can never save it twice
  const retryMessage = useCallback(
    (message) => {
      dispatch({
        type: 'MESSAGE_SENDING',
        message: { ...message, localStatus: 'sending', error: undefined },
      });
      deliver(message);
    },
    [deliver],
  );

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

  return { ...state, loadOlder, reloadHistory: loadHistory, sendMessage, retryMessage };
}
