export function TontinesSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-10 bg-muted rounded-lg w-64 mb-2" />
          <div className="h-5 bg-muted rounded-lg w-96" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-muted rounded-lg w-32" />
          <div className="h-10 bg-muted rounded-lg w-48" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="h-6 bg-muted rounded w-40" />
              <div className="h-6 bg-muted rounded-full w-20" />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-5 bg-muted rounded w-24" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-5 bg-muted rounded w-24" />
              </div>
            </div>

            {/* Members */}
            <div className="h-12 bg-muted rounded-lg" />

            {/* Progress */}
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full" />
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-16" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>

            {/* Button */}
            <div className="h-10 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

