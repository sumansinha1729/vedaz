import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from './ToastContext';
import Toaster from '../components/ui/Toaster';

const TOAST_DURATION_MS = 4000;
const MAX_TOASTS = 3;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'error') => {
      const id = crypto.randomUUID();
      setToasts((prev) =>
        prev.some((t) => t.message === message)
          ? prev
          : [...prev.slice(-(MAX_TOASTS - 1)), { id, message, type }],
      );
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
