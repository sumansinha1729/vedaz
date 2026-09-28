const ROWS = [
  { own: false, width: 'w-48' },
  { own: false, width: 'w-64' },
  { own: true, width: 'w-40' },
  { own: false, width: 'w-56' },
  { own: true, width: 'w-72' },
  { own: true, width: 'w-32' },
];

export default function MessageSkeleton() {
  return (
    <div className="space-y-4 py-4" aria-hidden="true">
      {ROWS.map((row, index) => (
        <div key={index} className={`flex items-end gap-2 ${row.own ? 'justify-end' : ''}`}>
          {!row.own && <div className="size-8 shrink-0 animate-pulse rounded-full bg-subtle" />}
          <div className={`h-10 max-w-[70%] animate-pulse rounded-2xl bg-subtle ${row.width}`} />
        </div>
      ))}
    </div>
  );
}
