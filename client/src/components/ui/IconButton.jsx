export default function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid size-11 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-subtle hover:text-fg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
