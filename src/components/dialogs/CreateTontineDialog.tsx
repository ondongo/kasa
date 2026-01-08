'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { unitsToCents } from '@/lib/money';

interface CreateTontineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  amount: number;
  currency: string;
  frequency: string;
  maxMembers: number;
}

export function CreateTontineDialog({ open, onOpenChange, onSuccess }: CreateTontineDialogProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      currency: 'XOF',
      frequency: 'MONTHLY',
      maxMembers: 10,
    },
  });

  const currency = watch('currency');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { createTontine } = await import('@/lib/actions/tontines');
      
      await createTontine({
        name: data.name,
        description: data.description,
        amount: unitsToCents(data.amount, data.currency),
        currency: data.currency,
        frequency: data.frequency as any,
        maxMembers: Number(data.maxMembers),
      });

      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une tontine</DialogTitle>
          <DialogDescription>
            Créez votre groupe d'épargne collective. Invitez des membres et gérez les tours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la tontine *</Label>
            <Input
              id="name"
              placeholder="Ex: Tontine Famille 2026"
              {...register('name', { required: 'Le nom est requis' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez l'objectif de cette tontine..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Montant et devise */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant par contribution *</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                placeholder="10000"
                {...register('amount', {
                  required: 'Le montant est requis',
                  min: { value: 0, message: 'Le montant doit être positif' },
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select
                defaultValue="XOF"
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                  <SelectItem value="XAF">FCFA (XAF)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dollar ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fréquence et max membres */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence des contributions</Label>
              <Select
                defaultValue="MONTHLY"
                onValueChange={(value) => setValue('frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                  <SelectItem value="BIWEEKLY">Bimensuel</SelectItem>
                  <SelectItem value="MONTHLY">Mensuel</SelectItem>
                  <SelectItem value="CUSTOM">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="50"
                {...register('maxMembers', {
                  required: true,
                  min: { value: 2, message: 'Minimum 2 membres' },
                  max: { value: 50, message: 'Maximum 50 membres' },
                })}
              />
              {errors.maxMembers && (
                <p className="text-sm text-red-500">{errors.maxMembers.message}</p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Comment ça marche ?</strong> Chaque membre contribue régulièrement
              le montant défini. À tour de rôle, un membre reçoit la somme totale collectée.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer la tontine
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

