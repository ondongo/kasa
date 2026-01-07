export function PricingSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-5xl animate-pulse">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="h-10 bg-muted rounded-lg w-80 mx-auto mb-4" />
        <div className="h-6 bg-muted rounded-lg w-96 mx-auto" />
      </div>

      {/* Statut actuel */}
      <div className="mb-8 rounded-lg border bg-card p-6">
        <div className="h-6 bg-muted rounded w-48 mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-32" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        </div>
      </div>

      {/* Plan d'abonnement */}
      <div className="max-w-md mx-auto">
        <div className="rounded-lg border bg-card p-6">
          <div className="h-8 bg-muted rounded w-40 mb-2" />
          <div className="h-4 bg-muted rounded w-full mb-8" />
          
          {/* Prix */}
          <div className="text-center mb-6">
            <div className="h-12 bg-muted rounded w-48 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-32 mx-auto mb-1" />
            <div className="h-3 bg-muted rounded w-40 mx-auto" />
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-5 w-5 bg-muted rounded-full shrink-0" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            ))}
          </div>

          {/* Bouton */}
          <div className="h-12 bg-muted rounded-lg w-full" />
        </div>
      </div>

      {/* Pourquoi Kasa */}
      <div className="mt-16">
        <div className="h-8 bg-muted rounded w-64 mx-auto mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <div className="h-6 bg-muted rounded w-40 mb-4 mx-auto" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

