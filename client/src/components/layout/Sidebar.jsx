import { useEffect } from 'react';
import { X } from 'lucide-react';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import IconButton from '../ui/IconButton';
import { formatLastSeen } from '../../utils/date';

function UserRow({ user, isMe }) {
  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-2">
      <Avatar name={user.username} size="sm" online={user.online} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {user.username}
          {isMe && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}
        </p>
        <p className="truncate text-xs text-muted">
          {user.online ? 'Online' : formatLastSeen(user.lastSeen)}
        </p>
      </div>
    </li>
  );
}

export default function Sidebar({ open, onClose, users, currentUser }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const online = users.filter((u) => u.online);
  const offline = users.filter((u) => !u.online);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="People"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-surface pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-all duration-200 md:static md:visible md:translate-x-0 ${
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4">
          <Logo />
          <span className="flex-1 font-semibold">Relay Chat</span>
          <IconButton label="Close sidebar" onClick={onClose} className="md:hidden">
            <X className="size-5" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          <h2 className="px-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Online — {online.length}
          </h2>
          <ul className="mt-2">
            {online.map((user) => (
              <UserRow key={user._id} user={user} isMe={user._id === currentUser._id} />
            ))}
          </ul>

          {offline.length > 0 && (
            <>
              <h2 className="mt-6 px-2 text-xs font-semibold tracking-wide text-muted uppercase">
                Offline — {offline.length}
              </h2>
              <ul className="mt-2 opacity-70">
                {offline.map((user) => (
                  <UserRow key={user._id} user={user} isMe={user._id === currentUser._id} />
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-line p-4">
          <Avatar name={currentUser.username} size="sm" />
          <div className="min-w-0">
            <p className="text-xs text-muted">Signed in as</p>
            <p className="truncate text-sm font-medium">{currentUser.username}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
