export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-2xl border border-slate-800/80 bg-black/40"
        >
          <div className="aspect-[4/3] bg-slate-800/50" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-slate-800/50" />
            <div className="h-3 w-full rounded bg-slate-800/50" />
            <div className="h-3 w-2/3 rounded bg-slate-800/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
