'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatMoneyWithConversion } from '@/lib/money';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/lib/actions/transactions';
import { toast } from 'react-toastify';

interface TransactionsTableProps {
  transactions: any[];
  onEdit: (transaction: any) => void;
  onDelete?: () => void;
  currency?: string;
}

export function TransactionsTable({ transactions, onEdit, onDelete, currency = 'EUR' }: TransactionsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) return;

    setDeleting(id);
    try {
      await deleteTransaction(id);
      toast.success('Transaction supprimée');
      onDelete?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const getOwnerLabel = (owner: string) => {
    switch (owner) {
      case 'ME':
        return 'Moi';
      case 'PARTNER':
        return 'Partenaire';
      case 'SHARED':
        return 'Commun';
      default:
        return owner;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        Aucune transaction pour ce mois
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Propriétaire</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.label}</TableCell>
              <TableCell>
                {formatMoneyWithConversion(
                  transaction.amount,
                  transaction.currency || currency || 'EUR',
                  currency || 'EUR'
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getOwnerLabel(transaction.owner)}</Badge>
              </TableCell>
              <TableCell>
                {transaction.subcategory?.name ||
                  transaction.category?.name ||
                  transaction.investmentEnvelope?.name ||
                  '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deleting === transaction.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

