'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { createSavingsBox, updateSavingsBox } from '@/lib/actions/savings-boxes';

interface SavingsBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingsBox?: any;
  onSuccess: () => void;
}

export function SavingsBoxDialog({
  open,
  onOpenChange,
  savingsBox,
  onSuccess,
}: SavingsBoxDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (savingsBox) {
      setName(savingsBox.name || '');
      setDescription(savingsBox.description || '');
      setTargetAmount((savingsBox.targetAmount / 100).toString());
      setMonthlyContribution(savingsBox.monthlyContribution ? (savingsBox.monthlyContribution / 100).toString() : '');
      setDueDate(savingsBox.dueDate ? new Date(savingsBox.dueDate).toISOString().split('T')[0] : '');
    } else {
      setName('');
      setDescription('');
      setTargetAmount('');
      setMonthlyContribution('');
      setDueDate('');
    }
  }, [savingsBox, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (savingsBox) {
        await updateSavingsBox(savingsBox.id, {
          name,
          description,
          targetAmount: Math.round(parseFloat(targetAmount) * 100),
          monthlyContribution: monthlyContribution ? Math.round(parseFloat(monthlyContribution) * 100) : undefined,
          dueDate: dueDate || undefined,
        });
      } else {
        await createSavingsBox({
          name,
          description,
          targetAmount: Math.round(parseFloat(targetAmount) * 100),
          monthlyContribution: monthlyContribution ? Math.round(parseFloat(monthlyContribution) * 100) : undefined,
          dueDate: dueDate || undefined,
        });
      }

      toast.success(savingsBox ? 'Caisse d\'épargne mise à jour' : 'Caisse d\'épargne créée');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {savingsBox ? 'Modifier la caisse d\'épargne' : 'Nouvelle caisse d\'épargne'}
          </DialogTitle>
          <DialogDescription>
            Créez une caisse d'épargne avec un objectif et une date limite
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la caisse</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vacances d'été"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de votre objectif d'épargne"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Montant cible (€)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="1000.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Contribution mensuelle (€) - optionnel</Label>
              <Input
                id="monthlyContribution"
                type="number"
                step="0.01"
                min="0"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="100.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date limite (optionnel)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : savingsBox ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

