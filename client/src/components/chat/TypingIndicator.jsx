function describe(users) {
  if (users.length === 1) return `${users[0].username} is typing`;
  if (users.length === 2) return `${users[0].username} and ${users[1].username} are typing`;
  return `${users.length} people are typing`;
}

export default function TypingIndicator({ users }) {
  return (
    <div className="h-6 shrink-0 px-4 sm:px-7" aria-live="polite">
      {users.length > 0 && (
        <p className="flex items-center gap-2 text-xs text-muted">
          <span className="flex gap-0.5" aria-hidden="true">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="size-1.5 rounded-full bg-muted motion-safe:animate-typing-dot"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          <span className="truncate">{describe(users)}…</span>
        </p>
      )}
    </div>
  );
}
