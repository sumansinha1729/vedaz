import { memo, useState } from 'react';
import Avatar from '../ui/Avatar';
import { formatFullDate, formatTime } from '../../utils/date';

function MessageBubble({ message, isOwn, isFirstInGroup, isLastInGroup }) {
  const [showDate, setShowDate] = useState(false);

  const bubbleColors = isOwn
    ? 'bg-primary text-on-primary'
    : 'border border-line bg-surface text-fg dark:border-transparent dark:bg-subtle';
  const tail = isLastInGroup ? (isOwn ? 'rounded-br-md' : 'rounded-bl-md') : '';

  return (
    <div
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
          className={`flex flex-wrap items-end justify-end gap-x-2.5 rounded-2xl px-3 py-1.5 shadow-xs ${bubbleColors} ${tail}`}
        >
          <p className="min-w-0 text-[15px] leading-relaxed wrap-break-word whitespace-pre-wrap">
            {message.text}
          </p>
          <div className="flex shrink-0 items-center gap-1 pb-0.5 text-[11px] opacity-70">
            <time dateTime={message.createdAt} title={formatFullDate(message.createdAt)}>
              {formatTime(message.createdAt)}
            </time>
          </div>
        </div>

        {showDate && (
          <span className="mt-1 px-1 text-xs text-muted">{formatFullDate(message.createdAt)}</span>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
