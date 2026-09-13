export function CardSkeleton() {
  return (
    <div className="card animate-pulse p-6">
      <div className="h-4 w-10 rounded bg-white/10" />
      <div className="mt-4 h-6 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-4 w-full rounded bg-white/5" />
      <div className="mt-2 h-4 w-5/6 rounded bg-white/5" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
