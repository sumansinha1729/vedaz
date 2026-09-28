import { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import Spinner from '../ui/Spinner';

const BANNERS = {
  reconnecting: {
    text: 'Connection lost. Reconnecting…',
    className: 'bg-warning/15 text-warning',
    icon: <Spinner />,
  },
  offline: {
    text: "You're offline. Check your internet connection.",
    className: 'bg-danger/10 text-danger',
    icon: <WifiOff className="size-4" aria-hidden="true" />,
  },
  restored: {
    text: 'Back online',
    className: 'bg-success/10 text-success',
    icon: <Wifi className="size-4" aria-hidden="true" />,
  },
};

export default function ConnectionBanner() {
  const { status } = useSocket();
  const [showRestored, setShowRestored] = useState(false);
  const previousStatus = useRef(status);

  useEffect(() => {
    const wasDown = ['reconnecting', 'offline'].includes(previousStatus.current);
    previousStatus.current = status;

    if (status !== 'connected' || !wasDown) return;

    setShowRestored(true);
    const timer = setTimeout(() => setShowRestored(false), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const banner = BANNERS[status] ?? (showRestored ? BANNERS.restored : null);

  return (
    <div role="status" aria-live="polite">
      {banner && (
        <div
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${banner.className}`}
        >
          {banner.icon}
          {banner.text}
        </div>
      )}
    </div>
  );
}
