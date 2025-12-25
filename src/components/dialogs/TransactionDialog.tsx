'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTransaction, updateTransaction } from '@/lib/actions/transactions';
import { eurosToCents, centsToEuros } from '@/lib/money';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  label: z.string().min(1, 'Le libellé est requis'),
  amount: z.string().min(1, 'Le montant est requis'),
  owner: z.enum(['ME', 'PARTNER', 'SHARED']),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  investmentEnvelopeId: z.string().optional(),
});

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  month: string;
  transaction?: any;
  categories?: any[];
  envelopes?: any[];
  onSuccess?: () => void;
}

export function TransactionDialog({
  open,
  onOpenChange,
  type,
  month,
  transaction,
  categories = [],
  envelopes = [],
  onSuccess,
}: TransactionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      amount: '',
      owner: 'SHARED',
      categoryId: '',
      subcategoryId: '',
      investmentEnvelopeId: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        label: transaction.label,
        amount: centsToEuros(transaction.amount).toString(),
        owner: transaction.owner,
        categoryId: transaction.categoryId || '',
        subcategoryId: transaction.subcategoryId || '',
        investmentEnvelopeId: transaction.investmentEnvelopeId || '',
      });
      setSelectedCategory(transaction.categoryId || '');
    } else {
      form.reset({
        label: '',
        amount: '',
        owner: 'SHARED',
        categoryId: '',
        subcategoryId: '',
        investmentEnvelopeId: '',
      });
      setSelectedCategory('');
    }
  }, [transaction, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const data = {
        type,
        month,
        label: values.label,
        amount: eurosToCents(parseFloat(values.amount)),
        owner: values.owner,
        categoryId: values.categoryId || null,
        subcategoryId: values.subcategoryId || null,
        investmentEnvelopeId: values.investmentEnvelopeId || null,
      };

      if (transaction) {
        await updateTransaction(transaction.id, data);
      } else {
        await createTransaction(data);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = type === 'INCOME' ? 'Revenu' : type === 'EXPENSE' ? 'Dépense' : 'Investissement';

  const category = categories.find((c) => c.id === selectedCategory);
  const subcategories = category?.subcategories || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Modifier' : 'Ajouter'} {typeLabel}
          </DialogTitle>
          <DialogDescription>
            {transaction ? 'Modifiez' : 'Ajoutez'} une transaction pour le mois {month}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Salaire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (€)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propriétaire</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ME">Moi</SelectItem>
                      <SelectItem value="PARTNER">Partenaire</SelectItem>
                      <SelectItem value="SHARED">Commun</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type !== 'INVESTMENT' && categories.length > 0 && (
              <>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                          form.setValue('subcategoryId', '');
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {subcategories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sous-catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une sous-catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories.map((subcat: any) => (
                              <SelectItem key={subcat.id} value={subcat.id}>
                                {subcat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            {type === 'INVESTMENT' && envelopes.length > 0 && (
              <FormField
                control={form.control}
                name="investmentEnvelopeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enveloppe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une enveloppe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {envelopes.map((env) => (
                          <SelectItem key={env.id} value={env.id}>
                            {env.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {transaction ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

