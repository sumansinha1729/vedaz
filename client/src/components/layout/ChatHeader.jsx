import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import IconButton from '../ui/IconButton';
import { useTheme } from '../../hooks/useTheme';

const CONNECTION_STATUS = {
  connecting: { dot: 'bg-muted', text: 'Connecting…' },
  reconnecting: { dot: 'bg-warning', text: 'Reconnecting…' },
  offline: { dot: 'bg-danger', text: 'Offline' },
};

export default function ChatHeader({
  icon,
  title,
  subtitle,
  subtitleActive,
  connectionStatus,
  hasUnreadElsewhere,
  onMenuClick,
  onLogout,
}) {
  const { theme, toggleTheme } = useTheme();
  const status = CONNECTION_STATUS[connectionStatus] ?? {
    dot: subtitleActive ? 'bg-success' : 'bg-muted/60',
    text: subtitle,
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-line bg-surface px-2 sm:gap-3 sm:px-4">
      <div className="relative md:hidden">
        <IconButton label="Open conversations" onClick={onMenuClick}>
          <Menu className="size-5" />
        </IconButton>
        {hasUnreadElsewhere && (
          <span className="absolute top-2 right-2 size-2.5 rounded-full bg-primary ring-2 ring-surface">
            <span className="sr-only">Unread messages</span>
          </span>
        )}
      </div>

      {icon}

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-semibold">{title}</h1>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <span className={`size-2 shrink-0 rounded-full ${status.dot}`} aria-hidden="true" />
          <span className="truncate">{status.text}</span>
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
