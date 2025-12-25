'use client';

import { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { TransactionsTable } from '@/components/tables/TransactionsTable';
import { TransactionDialog } from '@/components/dialogs/TransactionDialog';
import { TransactionsListSkeleton } from '@/components/skeletons/TransactionsListSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/actions/transactions';
import { getCategories } from '@/lib/actions/categories';
import { calculateBudgetSummary, getCurrentMonth } from '@/lib/calculations';
import { Plus } from 'lucide-react';
import type { Transaction } from '@prisma/client';

export default function ExpensesPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [month]);

  async function loadData() {
    setLoading(true);
    try {
      const [allTransactions, expenseCategories] = await Promise.all([
        getTransactions(month),
        getCategories('EXPENSE'),
      ]);

      const expenses = allTransactions.filter((t: Transaction) => t.type === 'EXPENSE');
      setTransactions(expenses);
      setCategories(expenseCategories);

      const budgetSummary = calculateBudgetSummary(allTransactions);
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
              <h1 className="text-3xl font-bold">Dépenses</h1>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une dépense
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={loadData}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        type="EXPENSE"
        month={month}
        transaction={editingTransaction}
        categories={categories}
        onSuccess={loadData}
      />
    </div>
  );
}

