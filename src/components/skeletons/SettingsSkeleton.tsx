export function SettingsSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar de navigation - Skeleton */}
      <div className="w-64 border-r bg-card/50 p-4">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-muted px-3"></div>
        <nav className="space-y-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="relative h-10 overflow-hidden rounded-lg bg-muted/50 px-3 py-2.5"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
          ))}
        </nav>
      </div>

      {/* Contenu principal - Skeleton */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <div className="h-9 w-48 animate-pulse rounded bg-muted"></div>
            <div className="h-5 w-72 animate-pulse rounded bg-muted"></div>
          </div>

          {/* Card 1 */}
          <div className="relative overflow-hidden rounded-lg border bg-card">
            <div className="p-6">
              <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-muted"></div>
                <div className="h-4 w-64 rounded bg-muted"></div>
              </div>
            </div>
            <div className="border-t p-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="h-4 w-16 rounded bg-muted"></div>
                    <div className="h-10 w-full rounded bg-muted"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 rounded bg-muted"></div>
                    <div className="h-10 w-full rounded bg-muted"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-muted"></div>
                  <div className="h-10 w-full rounded bg-muted"></div>
                </div>
                <div className="h-10 w-full rounded bg-muted"></div>
              </div>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden rounded-lg border bg-card">
            <div className="p-6">
              <div className="space-y-2">
                <div className="h-6 w-40 rounded bg-muted"></div>
                <div className="h-4 w-56 rounded bg-muted"></div>
              </div>
            </div>
            <div className="border-t p-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="h-4 w-16 rounded bg-muted"></div>
                    <div className="h-10 w-full rounded bg-muted"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 rounded bg-muted"></div>
                    <div className="h-10 w-full rounded bg-muted"></div>
                  </div>
                </div>
                <div className="h-10 w-full rounded bg-muted"></div>
              </div>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden rounded-lg border bg-card">
            <div className="p-6">
              <div className="space-y-2">
                <div className="h-6 w-32 rounded bg-muted"></div>
                <div className="h-4 w-48 rounded bg-muted"></div>
              </div>
            </div>
            <div className="border-t p-6">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-muted"></div>
                        <div className="h-3 w-48 rounded bg-muted"></div>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

