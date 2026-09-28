import { useLayoutEffect, useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { MESSAGE_MAX_LENGTH, ROOM_NAME } from '../../utils/constants';

const MAX_HEIGHT_PX = 160;
const COUNTER_THRESHOLD = 100;

// On phones, Enter adds a new line and the send button sends
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

export default function Composer({ onSend }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const trimmed = text.trim();
  const remaining = MESSAGE_MAX_LENGTH - text.length;
  const canSend = trimmed.length > 0;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [text]);

  const submit = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText('');
    textareaRef.current.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    if (isTouchDevice()) return;
    event.preventDefault();
    submit();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="shrink-0 border-t border-line bg-surface px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="flex items-end gap-2">
        <label htmlFor="message-input" className="sr-only">
          Message
        </label>
        <textarea
          id="message-input"
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder={`Message #${ROOM_NAME}`}
          aria-describedby="composer-help"
          className="block flex-1 resize-none rounded-2xl border border-line bg-app px-4 py-2.5 text-base leading-6 outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition hover:bg-primary-hover focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizontal className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div id="composer-help" className="mt-1.5 flex min-h-4 justify-between px-1 text-xs text-muted">
        <span className="hidden pointer-fine:inline">
          <kbd className="font-sans font-medium">Enter</kbd> to send,{' '}
          <kbd className="font-sans font-medium">Shift + Enter</kbd> for a new line
        </span>
        {remaining <= COUNTER_THRESHOLD && (
          <span className={`ml-auto ${remaining <= 20 ? 'text-danger' : ''}`} aria-live="polite">
            {remaining} characters left
          </span>
        )}
      </div>
    </form>
  );
}
