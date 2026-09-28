import { formatDaySeparator } from '../../utils/date';

export default function DateSeparator({ date }) {
  return (
    <div className="my-4 flex items-center gap-3" role="separator">
      <div className="h-px flex-1 bg-line" />
      <span className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-muted">
        {formatDaySeparator(date)}
      </span>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}
