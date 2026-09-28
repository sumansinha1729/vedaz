import { memo, useState } from 'react';
import { Check, CheckCheck, Clock, RotateCw, CircleAlert } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatFullDate, formatTime } from '../../utils/date';

const STATUS_ICONS = {
  sending: { Icon: Clock, label: 'Sending', className: 'opacity-70' },
  failed: { Icon: CircleAlert, label: 'Not sent', className: 'opacity-70' },
  sent: { Icon: Check, label: 'Sent', className: 'opacity-70' },
  delivered: { Icon: CheckCheck, label: 'Delivered', className: 'opacity-70' },
  read: { Icon: CheckCheck, label: 'Read', className: 'text-read' },
};

function StatusIcon({ status }) {
  const { Icon, label, className } = STATUS_ICONS[status];
  return (
    <span title={label} className="flex">
      <Icon className={`size-3.5 ${className}`} aria-label={label} />
    </span>
  );
}

function MessageBubble({
  message,
  status,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  onRetry,
  observeRef,
}) {
  const [showDate, setShowDate] = useState(false);
  const failed = status === 'failed';

  const bubbleColors = isOwn
    ? 'bg-primary text-on-primary'
    : 'border border-line bg-surface text-fg dark:border-transparent dark:bg-subtle';
  const tail = isLastInGroup ? (isOwn ? 'rounded-br-md' : 'rounded-bl-md') : '';

  return (
    <div
      ref={observeRef}
      data-message-id={message._id}
      className={`flex items-end gap-2 motion-safe:animate-message-in ${
        isOwn ? 'justify-end' : 'justify-start'
      } ${isFirstInGroup ? 'mt-3' : 'mt-0.5'}`}
    >
      {!isOwn &&
        (isLastInGroup ? (
          <Avatar name={message.sender.username} size="sm" />
        ) : (
          <div className="w-8 shrink-0" />
        ))}

      <div className={`flex max-w-[80%] flex-col sm:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && isFirstInGroup && (
          <span className="mb-1 ml-3 text-xs font-medium text-muted">{message.sender.username}</span>
        )}

        <div
          onClick={() => setShowDate((value) => !value)}
          className={`flex flex-wrap items-end justify-end gap-x-2.5 rounded-2xl px-3 py-1.5 shadow-xs ${bubbleColors} ${tail} ${
            failed ? 'opacity-70' : ''
          }`}
        >
          <p className="min-w-0 text-[15px] leading-relaxed wrap-break-word whitespace-pre-wrap">
            {message.text}
          </p>
          <div className="flex shrink-0 items-center gap-1 pb-0.5 text-[11px]">
            <time
              dateTime={message.createdAt}
              title={formatFullDate(message.createdAt)}
              className="opacity-70"
            >
              {formatTime(message.createdAt)}
            </time>
            {isOwn && <StatusIcon status={status} />}
          </div>
        </div>

        {failed && (
          <button
            onClick={() => onRetry(message)}
            title={message.error}
            className="mt-1 flex min-h-8 items-center gap-1.5 px-1 text-xs font-medium text-danger hover:underline"
          >
            <RotateCw className="size-3.5" aria-hidden="true" />
            Not sent. Tap to retry
          </button>
        )}

        {showDate && (
          <span className="mt-1 px-1 text-xs text-muted">{formatFullDate(message.createdAt)}</span>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
