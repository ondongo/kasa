'use client';

import { useState, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SavingsBoxDialog } from '@/components/dialogs/SavingsBoxDialog';
import { SavingsBoxesSkeleton } from '@/components/skeletons/SavingsBoxesSkeleton';
import { getCurrentMonth } from '@/lib/calculations';
import { usePreferences } from '@/contexts/PreferencesContext';
import { formatMoney } from '@/lib/money';
import { Plus, Trash2, Edit2, X, Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getSavingsBoxes,
  createSavingsBox,
  updateSavingsBox,
  deleteSavingsBox,
  addContribution,
} from '@/lib/actions/savings-boxes';

type SavingsBox = Awaited<ReturnType<typeof getSavingsBoxes>>[0];

export default function SavingsBoxesPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<SavingsBox | null>(null);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<SavingsBox | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionDate, setContributionDate] = useState('');
  const { preferences } = usePreferences();
  const currency = preferences?.currency || 'EUR';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSavingsBoxes();
      setSavingsBoxes(data as SavingsBox[]);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast.error(error.message || 'Erreur lors du chargement des caisses d\'épargne');
    } finally {
      setLoading(false);
    }
  }

  const handleAddContribution = (box: SavingsBox) => {
    setSelectedBox(box);
    setContributionAmount('');
    setContributionDate(new Date().toISOString().split('T')[0]);
    setContributionDialogOpen(true);
  };

  const handleSubmitContribution = async () => {
    if (!selectedBox || !contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error('Montant invalide');
      return;
    }

    try {
      await addContribution(selectedBox.id, {
        amount: Math.round(parseFloat(contributionAmount) * 100),
        contributionDate: contributionDate || new Date().toISOString(),
        month: month,
      });

      toast.success('Contribution ajoutée');
      setContributionDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout de la contribution');
    }
  };

  const handleRevoke = async (box: SavingsBox) => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer cette caisse d\'épargne ?')) {
      return;
    }

    try {
      await updateSavingsBox(box.id, { isRevoked: true });
      toast.success('Caisse d\'épargne révoquée');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la révocation');
    }
  };

  const handleDelete = async (box: SavingsBox) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette caisse d\'épargne ?')) {
      return;
    }

    try {
      await deleteSavingsBox(box.id);
      toast.success('Caisse d\'épargne supprimée');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  // Obtenir les contributions du mois sélectionné
  const getMonthContributions = (box: SavingsBox) => {
    return box.contributions.filter(c => c.month === month);
  };

  // Calculer le pourcentage de progression
  const getProgress = (box: SavingsBox) => {
    return Math.min((box.currentAmount / box.targetAmount) * 100, 100);
  };

  // Vérifier si la date limite est dépassée
  const isOverdue = (box: SavingsBox) => {
    if (!box.dueDate) return false;
    return new Date(box.dueDate) < new Date() && box.currentAmount < box.targetAmount;
  };

  return (
    <div className="flex h-screen flex-col">
      <Topbar month={month} onMonthChange={setMonth} />

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Caisses d'épargne</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos objectifs d'épargne avec calendrier mensuel
              </p>
            </div>
            <Button onClick={() => {
              setEditingBox(null);
              setDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle caisse
            </Button>
          </div>

          {loading ? (
            <SavingsBoxesSkeleton />
          ) : savingsBoxes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Aucune caisse d'épargne</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une caisse d'épargne
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savingsBoxes.map((box) => {
                const monthContributions = getMonthContributions(box);
                const progress = getProgress(box);
                const overdue = isOverdue(box);

                return (
                  <Card key={box.id} className={overdue ? 'border-red-500' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {box.name}
                            {overdue && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </CardTitle>
                          {box.description && (
                            <CardDescription className="mt-1">{box.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingBox(box);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(box)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progression */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-semibold">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{formatMoney(box.currentAmount, box.currency)}</span>
                          <span>{formatMoney(box.targetAmount, box.currency)}</span>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="space-y-2 text-sm">
                        {box.monthlyContribution && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Mensuel: {formatMoney(box.monthlyContribution, box.currency)}
                            </span>
                          </div>
                        )}
                        {box.dueDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className={`text-muted-foreground ${overdue ? 'text-red-500 font-semibold' : ''}`}>
                              Date limite: {new Date(box.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Contributions du mois */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Contributions - {new Date(`${month}-01`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h4>
                        {monthContributions.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Aucune contribution ce mois</p>
                        ) : (
                          <div className="space-y-1">
                            {monthContributions.map((contribution) => (
                              <div
                                key={contribution.id}
                                className="flex items-center justify-between text-xs p-2 rounded bg-muted/50"
                              >
                                <span>
                                  {new Date(contribution.contributionDate).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="font-semibold">
                                  {formatMoney(contribution.amount, box.currency)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddContribution(box)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter
                        </Button>
                        {box.isRevoked ? (
                          <Badge variant="destructive">Révoquée</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevoke(box)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Révoquer
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SavingsBoxDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        savingsBox={editingBox}
        onSuccess={loadData}
      />

      {/* Dialog pour ajouter une contribution */}
      <Dialog open={contributionDialogOpen} onOpenChange={setContributionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une contribution</DialogTitle>
            <DialogDescription>
              Ajoutez une contribution à la caisse "{selectedBox?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Montant (€)</Label>
              <Input
                id="contributionAmount"
                type="number"
                step="0.01"
                min="0"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="100.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contributionDate">Date</Label>
              <Input
                id="contributionDate"
                type="date"
                value={contributionDate}
                onChange={(e) => setContributionDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContributionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitContribution}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

