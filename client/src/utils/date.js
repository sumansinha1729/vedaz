import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatLastSeen(date) {
  if (!date) return 'Offline';
  return `Last seen ${dayjs(date).fromNow()}`;
}

export function formatTime(date) {
  return dayjs(date).format('h:mm A');
}

export function formatFullDate(date) {
  return dayjs(date).format('dddd, D MMMM YYYY [at] h:mm A');
}

export function formatDaySeparator(date) {
  const day = dayjs(date);
  if (day.isSame(dayjs(), 'day')) return 'Today';
  if (day.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  if (day.isSame(dayjs(), 'year')) return day.format('dddd, D MMMM');
  return day.format('D MMMM YYYY');
}

export function isSameDay(a, b) {
  return dayjs(a).isSame(b, 'day');
}

export function minutesBetween(a, b) {
  return Math.abs(dayjs(a).diff(b, 'minute'));
}
