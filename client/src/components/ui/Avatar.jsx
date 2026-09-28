import { getAvatarColor, getInitials } from '../../utils/avatar';

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
};

export default function Avatar({ name, size = 'md', online }) {
  return (
    <div className="relative shrink-0">
      <div
        className={`grid place-items-center rounded-full font-semibold text-white ${SIZES[size]} ${getAvatarColor(name)}`}
        aria-hidden="true"
      >
        {getInitials(name)}
      </div>
      {online !== undefined && (
        <span
          className={`absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-surface ${
            online ? 'bg-success' : 'bg-muted/60'
          }`}
        />
      )}
    </div>
  );
}
