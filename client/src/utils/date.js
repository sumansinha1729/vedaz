import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatLastSeen(date) {
  if (!date) return 'Offline';
  return `Last seen ${dayjs(date).fromNow()}`;
}
