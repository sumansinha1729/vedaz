import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  ghost: 'text-muted hover:bg-subtle hover:text-fg',
};

export default function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
