'use client';

import { formatEuros } from '@/lib/money';

interface CategoryChartProps {
  categories: {
    name: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
}

export function CategoryChart({ categories }: CategoryChartProps) {
  const maxAmount = Math.max(...categories.map((c) => c.amount));

  return (
    <div className="space-y-4">
      {categories
        .sort((a, b) => b.amount - a.amount)
        .map((category, index) => (
          <div key={index} className="group space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: category.color }}>
                  {formatEuros(category.amount)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="relative h-10 overflow-hidden rounded-lg bg-muted/30">
              <div
                className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out"
                style={{
                  width: `${(category.amount / maxAmount) * 100}%`,
                  backgroundColor: category.color,
                }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

