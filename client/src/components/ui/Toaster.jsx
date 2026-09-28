import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const STYLES = {
  error: { Icon: CircleAlert, className: 'text-danger' },
  success: { Icon: CircleCheck, className: 'text-success' },
  info: { Icon: Info, className: 'text-primary' },
};

export default function Toaster({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4.5rem)] z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map(({ id, message, type }) => {
        const { Icon, className } = STYLES[type];
        return (
          <div
            key={id}
            role={type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-line bg-surface py-2 pr-2 pl-4 text-sm shadow-lg motion-safe:animate-toast-in"
          >
            <Icon className={`size-5 shrink-0 ${className}`} aria-hidden="true" />
            <p className="flex-1">{message}</p>
            <button
              onClick={() => onDismiss(id)}
              aria-label="Dismiss notification"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-subtle hover:text-fg"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
