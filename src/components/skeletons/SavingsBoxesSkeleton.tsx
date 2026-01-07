import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SavingsBoxesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded bg-muted/60 animate-pulse" />
          <div className="h-5 w-64 rounded bg-muted/60 animate-pulse" />
        </div>
        <div className="h-10 w-40 rounded bg-muted/60 animate-pulse" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-32 rounded bg-muted/60 animate-pulse" />
                  <div className="h-4 w-48 rounded bg-muted/60 animate-pulse" />
                </div>
                <div className="flex gap-1">
                  <div className="h-8 w-8 rounded bg-muted/60 animate-pulse" />
                  <div className="h-8 w-8 rounded bg-muted/60 animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progression */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-20 rounded bg-muted/60 animate-pulse" />
                  <div className="h-3 w-12 rounded bg-muted/60 animate-pulse" />
                </div>
                <div className="h-3 w-full rounded-full bg-muted/60 animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-muted/60 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted/60 animate-pulse" />
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted/60 animate-pulse" />
                <div className="h-4 w-40 rounded bg-muted/60 animate-pulse" />
              </div>

              {/* Contributions */}
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-muted/60 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-8 w-full rounded bg-muted/60 animate-pulse" />
                  <div className="h-8 w-full rounded bg-muted/60 animate-pulse" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <div className="h-9 flex-1 rounded bg-muted/60 animate-pulse" />
                <div className="h-9 w-24 rounded bg-muted/60 animate-pulse" />
              </div>
            </CardContent>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </Card>
        ))}
      </div>
    </div>
  );
}

