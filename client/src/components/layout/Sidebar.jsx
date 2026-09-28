import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Hash, X } from 'lucide-react';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import IconButton from '../ui/IconButton';
import { formatLastSeen } from '../../utils/date';
import { GENERAL_ROOM, dmRoomId } from '../../utils/rooms';
import { ROOM_NAME } from '../../utils/constants';

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-on-primary">
      {count > 99 ? '99+' : count}
      <span className="sr-only"> unread</span>
    </span>
  );
}

function NavItem({ to, active, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors ${
        active ? 'bg-primary/10 text-fg' : 'hover:bg-subtle'
      }`}
    >
      {children}
    </Link>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="px-2 text-xs font-semibold tracking-wide text-muted uppercase">{children}</h2>
  );
}

export default function Sidebar({ open, onClose, users, currentUser, activeRoom, getUnreadCount }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const people = users.filter((u) => u._id !== currentUser._id);

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
        aria-label="Conversations"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-surface pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-all duration-200 md:static md:visible md:translate-x-0 ${
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4">
          <Logo />
          <span className="flex-1 font-semibold">Relay Chat</span>
          <IconButton
            ref={closeButtonRef}
            label="Close sidebar"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="size-5" />
          </IconButton>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <SectionTitle>Channels</SectionTitle>
          <ul className="mt-2">
            <li>
              <NavItem to="/" active={activeRoom === GENERAL_ROOM} onClick={onClose}>
                <span className="grid size-8 place-items-center rounded-lg bg-subtle text-muted">
                  <Hash className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium">{ROOM_NAME}</span>
                <UnreadBadge count={getUnreadCount(GENERAL_ROOM)} />
              </NavItem>
            </li>
          </ul>

          <div className="mt-6">
            <SectionTitle>Direct messages</SectionTitle>
          </div>
          {people.length === 0 ? (
            <p className="mt-2 px-2 text-sm text-muted">No one else has joined yet.</p>
          ) : (
            <ul className="mt-2">
              {people.map((person) => {
                const room = dmRoomId(currentUser._id, person._id);
                return (
                  <li key={person._id}>
                    <NavItem to={`/dm/${person._id}`} active={activeRoom === room} onClick={onClose}>
                      <Avatar name={person.username} size="sm" online={person.online} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{person.username}</p>
                        <p className="truncate text-xs text-muted">
                          {person.online ? 'Online' : formatLastSeen(person.lastSeen)}
                        </p>
                      </div>
                      <UnreadBadge count={getUnreadCount(room)} />
                    </NavItem>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <div className="flex items-center gap-3 border-t border-line p-4">
          <Avatar name={currentUser.username} size="sm" online />
          <div className="min-w-0">
            <p className="text-xs text-muted">Signed in as</p>
            <p className="truncate text-sm font-medium">{currentUser.username}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
