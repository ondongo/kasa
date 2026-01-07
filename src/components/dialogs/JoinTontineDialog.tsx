'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface JoinTontineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  inviteCode: string;
}

export function JoinTontineDialog({ open, onOpenChange, onSuccess }: JoinTontineDialogProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/tontines/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la tentative de rejoindre');
      }

      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la tentative de rejoindre');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rejoindre une tontine</DialogTitle>
          <DialogDescription>
            Entrez le code d'invitation que vous avez reçu pour rejoindre une tontine.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Code d'invitation</Label>
            <Input
              id="inviteCode"
              placeholder="Ex: ABC123XYZ"
              className="font-mono text-lg tracking-wider uppercase"
              {...register('inviteCode', {
                required: 'Le code d\'invitation est requis',
                minLength: { value: 6, message: 'Le code doit avoir au moins 6 caractères' },
              })}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
            {errors.inviteCode && (
              <p className="text-sm text-red-500">{errors.inviteCode.message}</p>
            )}
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground">
              💡 Le code d'invitation vous a été partagé par le créateur de la tontine.
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
              Rejoindre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

