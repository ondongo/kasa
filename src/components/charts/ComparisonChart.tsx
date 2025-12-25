'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatEurosWithVisibility } from '@/lib/money';

interface ComparisonChartProps {
  current: {
    income: number;
    expenses: number;
    investments: number;
    savings: number;
  };
  isHidden?: boolean;
}

export function ComparisonChart({ current, isHidden = false }: ComparisonChartProps) {
  const total = current.income;
  const expenseRate = total > 0 ? (current.expenses / total) * 100 : 0;
  const investmentRate = total > 0 ? (current.investments / total) * 100 : 0;
  const savingsRate = total > 0 ? (current.savings / total) * 100 : 0;

  const items = [
    {
      label: 'Revenus',
      value: current.income,
      percentage: 100,
      color: '#10b981',
      icon: TrendingUp,
      description: 'Total des revenus du mois',
    },
    {
      label: 'Dépenses',
      value: current.expenses,
      percentage: expenseRate,
      color: '#ef4444',
      icon: TrendingDown,
      description: 'Total des dépenses',
    },
    {
      label: 'Investissements',
      value: current.investments,
      percentage: investmentRate,
      color: '#3b82f6',
      icon: TrendingUp,
      description: 'Mis de côté pour investir',
    },
    {
      label: 'Reste à vivre',
      value: current.savings,
      percentage: savingsRate,
      color: '#F2C086',
      icon: current.savings >= 0 ? TrendingUp : TrendingDown,
      description: current.savings >= 0 ? 'Surplus disponible' : 'Déficit',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 p-6 shadow-sm transition-all hover:shadow-lg"
          >
            {/* Effet de brillance au hover */}
            <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="relative space-y-4">
              {/* En-tête */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold tabular-nums" style={{ color: item.color }}>
                    {formatEurosWithVisibility(item.value, isHidden)}
                  </p>
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: item.color }} />
                </div>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.description}</span>
                  <span className="font-semibold" style={{ color: item.color }}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

