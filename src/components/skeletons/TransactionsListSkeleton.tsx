export function TransactionsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header avec titre et bouton - Skeleton */}
      <div className="flex items-center justify-between">
        <div className="relative h-9 w-40 overflow-hidden rounded bg-muted/60">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="relative h-10 w-48 overflow-hidden rounded-md bg-muted/60">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Card avec tableau - Skeleton */}
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <div className="p-6">
          <div className="h-6 w-48 rounded bg-muted/60"></div>
        </div>
        <div className="border-t p-6">
          {/* En-tête du tableau */}
          <div className="mb-4 grid grid-cols-5 gap-4 border-b pb-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 rounded bg-muted/60"></div>
            ))}
          </div>

          {/* Lignes du tableau */}
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-3">
                <div className="h-4 rounded bg-muted/60"></div>
                <div className="h-4 rounded bg-muted/60"></div>
                <div className="h-4 w-24 rounded bg-muted/60"></div>
                <div className="h-4 w-16 rounded bg-muted/60"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded bg-muted/60"></div>
                  <div className="h-8 w-8 rounded bg-muted/60"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </div>
  );
}

