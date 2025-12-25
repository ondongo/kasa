export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cartes comparatives - Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border bg-card p-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-muted/60"></div>
                  <div className="h-8 w-32 rounded bg-muted/60"></div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted/60"></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-32 rounded bg-muted/60"></div>
                  <div className="h-3 w-12 rounded bg-muted/60"></div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60"></div>
              </div>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Graphiques côte à côte - Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut Chart Skeleton */}
        <div className="relative overflow-hidden rounded-lg border bg-card">
          <div className="p-6">
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-muted/60"></div>
              <div className="h-4 w-64 rounded bg-muted/60"></div>
            </div>
          </div>
          <div className="border-t p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-64 w-64 rounded-full bg-muted/60"></div>
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted/60"></div>
                    <div className="h-3 w-20 rounded bg-muted/60"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Taux d'épargne - Skeleton */}
        <div className="relative overflow-hidden rounded-lg border bg-card">
          <div className="p-6">
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-muted/60"></div>
              <div className="h-4 w-64 rounded bg-muted/60"></div>
            </div>
          </div>
          <div className="border-t p-6">
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-32 rounded bg-muted/60"></div>
                    <div className="h-6 w-16 rounded bg-muted/60"></div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted/60"></div>
                </div>
              ))}
              <div className="h-16 w-full rounded-lg bg-muted/60"></div>
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Diagramme Sankey - Skeleton */}
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <div className="p-6">
          <div className="space-y-2">
            <div className="h-6 w-40 rounded bg-muted/60"></div>
            <div className="h-4 w-96 rounded bg-muted/60"></div>
          </div>
        </div>
        <div className="border-t p-6">
          <div className="flex h-96 items-center justify-center">
            <div className="h-64 w-full rounded bg-muted/60"></div>
          </div>
        </div>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </div>
  );
}

