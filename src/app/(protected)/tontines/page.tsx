'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, Coins, AlertCircle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { CreateTontineDialog } from '@/components/dialogs/CreateTontineDialog';
import { JoinTontineDialog } from '@/components/dialogs/JoinTontineDialog';
import { TontinesSkeleton } from '@/components/skeletons/TontinesSkeleton';
import { formatMoney } from '@/lib/money';

interface Tontine {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  frequency: string;
  status: string;
  startDate: string | null;
  inviteCode: string;
  maxMembers: number;
  createdAt: string;
  _count: {
    members: number;
    rounds: number;
  };
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  members: Array<{
    id: string;
    status: string;
    turnOrder: number | null;
    hasReceived: boolean;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  currentRound?: {
    id: string;
    roundNumber: number;
    dueDate: string;
    collectedAmount: number;
    amount: number;
    isPaid: boolean;
    recipientId: string | null;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  ACTIVE: 'bg-green-500',
  COMPLETED: 'bg-[#F2C086]',
  CANCELLED: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Brouillon',
  ACTIVE: 'Active',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

const frequencyLabels: Record<string, string> = {
  WEEKLY: 'Hebdomadaire',
  BIWEEKLY: 'Bimensuel',
  MONTHLY: 'Mensuel',
  CUSTOM: 'Personnalisé',
};

export default function TontinesPage() {
  const { data: session } = useSession();
  const [tontines, setTontines] = useState<Tontine[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  const loadTontines = async () => {
    try {
      const { getTontines } = await import('@/lib/actions/tontines');
      const data = await getTontines();
      setTontines(data);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des tontines');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTontines();
  }, []);

  const handleTontineCreated = () => {
    setCreateDialogOpen(false);
    loadTontines();
    toast.success('Tontine créée avec succès !');
  };

  const handleTontineJoined = () => {
    setJoinDialogOpen(false);
    loadTontines();
    toast.success('Vous avez rejoint la tontine !');
  };

  const getNextRecipient = (tontine: Tontine) => {
    if (!tontine.currentRound || !tontine.currentRound.recipientId) return null;
    const member = tontine.members.find((m) => m.user.id === tontine.currentRound?.recipientId);
    return member?.user;
  };

  const getMyTurn = (tontine: Tontine) => {
    const myMembership = tontine.members.find((m) => m.user.id === session?.user?.id);
    return myMembership?.turnOrder || null;
  };

  if (loading) {
    return <TontinesSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mes Tontines</h1>
          <p className="text-muted-foreground">
            Gérez vos cagnottes collectives et épargnes en groupe
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Rejoindre
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Créer une tontine
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {tontines.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucune tontine</h3>
            <p className="text-muted-foreground mb-6">
              Créez votre première tontine ou rejoignez-en une existante
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setJoinDialogOpen(true)}>
                Rejoindre une tontine
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Créer une tontine
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tontines Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tontines.map((tontine) => {
          const nextRecipient = getNextRecipient(tontine);
          const myTurn = getMyTurn(tontine);
          const isMyTurn = nextRecipient?.id === session?.user?.id;
          const progress = tontine.currentRound
            ? (tontine.currentRound.collectedAmount / tontine.currentRound.amount) * 100
            : 0;

          return (
            <Card key={tontine.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{tontine.name}</CardTitle>
                  <Badge className={statusColors[tontine.status]}>
                    {statusLabels[tontine.status]}
                  </Badge>
                </div>
                {tontine.description && (
                  <CardDescription className="line-clamp-2">
                    {tontine.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Montant et fréquence */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contribution</p>
                      <p className="font-semibold">
                        {formatMoney(tontine.amount, tontine.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fréquence</p>
                      <p className="font-semibold text-sm">
                        {frequencyLabels[tontine.frequency]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Membres */}
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {tontine._count.members} / {tontine.maxMembers} membres
                    </span>
                  </div>
                  {myTurn && (
                    <Badge variant="outline" className="text-xs">
                      Tour #{myTurn}
                    </Badge>
                  )}
                </div>

                {/* Tour actuel */}
                {tontine.status === 'ACTIVE' && tontine.currentRound && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tour actuel</span>
                      <span className="font-semibold">
                        #{tontine.currentRound.roundNumber}
                      </span>
                    </div>

                    {/* Barre de progression */}
                    <div className="space-y-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {formatMoney(
                            tontine.currentRound.collectedAmount,
                            tontine.currency
                          )}
                        </span>
                        <span>
                          {formatMoney(tontine.currentRound.amount, tontine.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Bénéficiaire */}
                    {nextRecipient && (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-lg ${
                          isMyTurn
                            ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
                            : 'bg-muted/50'
                        }`}
                      >
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            {isMyTurn ? 'C\'est votre tour !' : 'Bénéficiaire'}
                          </p>
                          <p className="font-semibold text-sm">
                            {nextRecipient.name || nextRecipient.email}
                          </p>
                        </div>
                        {tontine.currentRound.isPaid && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    )}

                    {/* Date limite */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Échéance:{' '}
                        {new Date(tontine.currentRound.dueDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = `/tontines/${tontine.id}`)}
                >
                  Voir les détails
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Dialogs */}
      <CreateTontineDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleTontineCreated}
      />
      <JoinTontineDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onSuccess={handleTontineJoined}
      />
    </div>
  );
}

