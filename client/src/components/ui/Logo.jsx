import { MessageCircle } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  const sizes = size === 'lg' ? 'size-14 rounded-2xl [&>svg]:size-7' : 'size-9 rounded-xl [&>svg]:size-5';

  return (
    <div
      className={`grid place-items-center bg-primary text-on-primary shadow-sm shadow-primary/30 ${sizes}`}
    >
      <MessageCircle aria-hidden="true" />
    </div>
  );
}
