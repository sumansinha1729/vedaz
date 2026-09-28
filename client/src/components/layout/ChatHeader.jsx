import { Hash, LogOut, Menu, Moon, Sun } from 'lucide-react';
import IconButton from '../ui/IconButton';
import { useTheme } from '../../hooks/useTheme';
import { ROOM_NAME } from '../../utils/constants';

const STATUS = {
  connecting: { dot: 'bg-muted', text: 'Connecting…' },
  reconnecting: { dot: 'bg-warning', text: 'Reconnecting…' },
  offline: { dot: 'bg-danger', text: 'Offline' },
};

export default function ChatHeader({ onlineCount, connectionStatus, onMenuClick, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const status = STATUS[connectionStatus] ?? {
    dot: 'bg-success',
    text: `${onlineCount} online`,
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-line bg-surface px-2 sm:gap-3 sm:px-4">
      <IconButton label="Open sidebar" onClick={onMenuClick} className="md:hidden">
        <Menu className="size-5" />
      </IconButton>

      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-subtle text-muted">
        <Hash className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-semibold">{ROOM_NAME}</h1>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <span className={`size-2 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.text}
        </p>
      </div>

      <IconButton
        label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </IconButton>
      <IconButton label="Log out" onClick={onLogout}>
        <LogOut className="size-5" />
      </IconButton>
    </header>
  );
}
