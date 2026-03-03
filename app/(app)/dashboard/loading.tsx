export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#000904] py-8 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-8 animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 w-40 bg-white/[0.06] rounded-lg" />

        {/* Balance card skeleton */}
        <div className="h-28 bg-white/[0.06] border border-white/[0.08] rounded-2xl" />

        {/* Action buttons skeleton */}
        <div className="flex gap-4">
          <div className="flex-1 h-12 bg-white/[0.06] rounded-xl" />
          <div className="flex-1 h-12 bg-white/[0.06] rounded-xl" />
        </div>

        {/* Transactions skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-6 w-48 bg-white/[0.06] rounded-lg" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/[0.06] border border-white/[0.08] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
