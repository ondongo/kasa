'use client';

import { formatEuros } from '@/lib/money';

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

export function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="font-semibold" style={{ color: item.color }}>
              {formatEuros(item.value)}
            </span>
          </div>
          <div className="relative h-12 overflow-hidden rounded-lg bg-muted/30">
            <div
              className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            >
              <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-foreground/80">
                {((item.value / maxValue) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

