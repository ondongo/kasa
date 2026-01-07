'use client';

import { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { TransactionsTable } from '@/components/tables/TransactionsTable';
import { TransactionDialog } from '@/components/dialogs/TransactionDialog';
import { TransactionsListSkeleton } from '@/components/skeletons/TransactionsListSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/actions/transactions';
import { getEnvelopes } from '@/lib/actions/envelopes';
import { calculateBudgetSummary, getCurrentMonth } from '@/lib/calculations';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Plus } from 'lucide-react';

export default function InvestmentsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const { preferences } = usePreferences();
  const currency = preferences?.currency || 'EUR';

  useEffect(() => {
    loadData();
  }, [month]);

  async function loadData() {
    setLoading(true);
    try {
      const [allTransactions, investmentEnvelopes] = await Promise.all([
        getTransactions(month),
        getEnvelopes(),
      ]);

      const investments = allTransactions.filter((t: any) => t.type === 'INVESTMENT');
      setTransactions(investments);
      setEnvelopes(investmentEnvelopes);

      const budgetSummary = calculateBudgetSummary(allTransactions, currency);
      setSummary(budgetSummary);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="flex h-screen flex-col">
      <Topbar month={month} onMonthChange={setMonth} summary={summary} />

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <TransactionsListSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Investissements</h1>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un investissement
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des investissements</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={loadData}
                  currency={currency}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        type="INVESTMENT"
        month={month}
        transaction={editingTransaction}
        envelopes={envelopes}
        onSuccess={loadData}
      />
    </div>
  );
}

