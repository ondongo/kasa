'use client';

import { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { SankeyChart } from '@/components/charts/SankeyChart';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { getTransactions } from '@/lib/actions/transactions';
import { calculateBudgetSummary, buildSankeyData, getCurrentMonth } from '@/lib/calculations';
import { formatEuros } from '@/lib/money';
import { useVisibility } from '@/contexts/VisibilityContext';

export default function DashboardPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [sankeyData, setSankeyData] = useState<any>({ nodes: [], links: [] });
  const { isHidden } = useVisibility();

  useEffect(() => {
    loadData();
  }, [month]);

  async function loadData() {
    setLoading(true);
    try {
      const transactions = await getTransactions(month);
      const budgetSummary = calculateBudgetSummary(transactions);
      const sankey = buildSankeyData(transactions);

      setSummary(budgetSummary);
      setSankeyData(sankey);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Topbar month={month} onMonthChange={setMonth} summary={summary} />

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Vue d'ensemble avec graphiques comparatifs */}
            <ComparisonChart
              current={{
                income: summary?.totalIncome || 0,
                expenses: summary?.totalExpense || 0,
                investments: summary?.totalInvestment || 0,
                savings: summary?.savings || 0,
              }}
              isHidden={isHidden}
            />

            {/* Graphiques côte à côte */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Répartition en donut */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des flux</CardTitle>
                  <CardDescription>
                    Distribution de votre budget mensuel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart
                    data={[
                      {
                        label: 'Dépenses',
                        value: summary?.totalExpense || 0,
                        color: '#ef4444',
                      },
                      {
                        label: 'Investissements',
                        value: summary?.totalInvestment || 0,
                        color: '#3b82f6',
                      },
                      {
                        label: 'Reste à vivre',
                        value: Math.max(summary?.savings || 0, 0),
                        color: '#F2C086',
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Taux d'épargne */}
              <Card>
                <CardHeader>
                  <CardTitle>Taux d'épargne</CardTitle>
                  <CardDescription>
                    Performance de votre gestion budgétaire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Taux d'investissement */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taux d'investissement</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {summary?.savingsRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-blue-600 transition-all duration-700"
                        style={{ width: `${Math.min(summary?.savingsRate || 0, 100)}%` }}
                      >
                        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/30 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Taux d'épargne global */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taux d'épargne global</span>
                      <span className="text-2xl font-bold" style={{ color: '#F2C086' }}>
                        {summary?.globalSavingsRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(summary?.globalSavingsRate || 0, 100)}%`,
                          backgroundColor: '#F2C086',
                        }}
                      >
                        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/30 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Objectif recommandé */}
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-sm text-muted-foreground">
                      💡 Un taux d'épargne de <span className="font-semibold">20%</span> ou plus
                      est recommandé pour une bonne santé financière.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Diagramme Sankey */}
            <Card>
              <CardHeader>
                <CardTitle>Flux financiers</CardTitle>
                <CardDescription>
                  Visualisation détaillée de vos revenus, dépenses et investissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SankeyChart data={sankeyData} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

