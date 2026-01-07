export function TontineDetailSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl animate-pulse">
      {/* Back button */}
      <div className="h-10 bg-muted rounded w-32 mb-4" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="h-10 bg-muted rounded w-96 mb-2" />
          <div className="h-5 bg-muted rounded w-[600px]" />
        </div>
        <div className="h-10 bg-muted rounded-full w-32" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="h-6 bg-muted rounded w-40 mb-4" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-20 mb-2" />
                    <div className="h-6 bg-muted rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current round */}
          <div className="rounded-lg border bg-card p-6">
            <div className="h-6 bg-muted rounded w-48 mb-2" />
            <div className="h-4 bg-muted rounded w-64 mb-6" />
            
            <div className="space-y-4">
              <div className="h-3 bg-muted rounded-full" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="rounded-lg border bg-card p-6">
            <div className="h-6 bg-muted rounded w-32 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="h-6 bg-muted rounded w-24 mb-4" />
            <div className="h-12 bg-muted rounded-lg" />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="h-6 bg-muted rounded w-32 mb-2" />
            <div className="h-4 bg-muted rounded w-full mb-4" />
            <div className="h-12 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

