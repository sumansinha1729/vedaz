const AVATAR_COLORS = [
  'bg-rose-600',
  'bg-orange-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-sky-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-fuchsia-600',
  'bg-pink-600',
  'bg-cyan-700',
];

export function getInitials(name = '') {
  const parts = name.split(/[_\s]+/).filter(Boolean);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Same name always gives the same color
export function getAvatarColor(name = '') {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
