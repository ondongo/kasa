'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Coins, Share2, Play, CheckCircle2, Clock, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { formatMoney } from '@/lib/money';
import { TontineDetailSkeleton } from '@/components/skeletons/TontineDetailSkeleton';

interface TontineDetail {
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
    joinedAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  rounds: Array<{
    id: string;
    roundNumber: number;
    dueDate: string;
    amount: number;
    collectedAmount: number;
    isPaid: boolean;
    paidAt: string | null;
    recipientId: string | null;
    contributions: Array<{
      id: string;
      amount: number;
      status: string;
      paidAt: string | null;
      user: {
        id: string;
        name: string | null;
        email: string;
      };
    }>;
  }>;
}

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

const contributionStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  LATE: 'En retard',
  MISSED: 'Manquée',
};

export default function TontineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tontine, setTontine] = useState<TontineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const loadTontine = async () => {
    try {
      const response = await fetch(`/api/tontines/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Tontine introuvable');
          router.push('/tontines');
          return;
        }
        throw new Error('Erreur lors du chargement');
      }
      const data = await response.json();
      setTontine(data);
    } catch (error) {
      toast.error('Erreur lors du chargement de la tontine');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTontine();
  }, [params.id]);

  const copyInviteCode = () => {
    if (!tontine) return;
    navigator.clipboard.writeText(tontine.inviteCode);
    toast.success('Code d\'invitation copié !');
  };

  const handleStartTontine = async () => {
    if (!tontine) return;
    setStarting(true);
    try {
      const response = await fetch(`/api/tontines/${tontine.id}/start`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du démarrage');
      }
      toast.success('Tontine démarrée avec succès !');
      loadTontine();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du démarrage');
      console.error(error);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <TontineDetailSkeleton />;
  }

  if (!tontine) {
    return null;
  }

  const isCreator = tontine.creator.id === session?.user?.id;
  const currentRound = tontine.rounds[0];
  const myMembership = tontine.members.find((m) => m.user.id === session?.user?.id);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/tontines')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux tontines
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{tontine.name}</h1>
            {tontine.description && (
              <p className="text-muted-foreground">{tontine.description}</p>
            )}
          </div>
          <Badge className="text-sm px-4 py-2">
            {statusLabels[tontine.status]}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contribution</p>
                  <p className="text-lg font-bold">
                    {formatMoney(tontine.amount, tontine.currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fréquence</p>
                  <p className="text-lg font-bold">
                    {frequencyLabels[tontine.frequency]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Membres</p>
                  <p className="text-lg font-bold">
                    {tontine.members.length} / {tontine.maxMembers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tour actuel */}
          {tontine.status === 'ACTIVE' && currentRound && (
            <Card>
              <CardHeader>
                <CardTitle>Tour actuel #{currentRound.roundNumber}</CardTitle>
                <CardDescription>
                  Échéance: {new Date(currentRound.dueDate).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progression */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-semibold">
                      {Math.round((currentRound.collectedAmount / currentRound.amount) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (currentRound.collectedAmount / currentRound.amount) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatMoney(currentRound.collectedAmount, tontine.currency)}</span>
                    <span>{formatMoney(currentRound.amount, tontine.currency)}</span>
                  </div>
                </div>

                {/* Contributions */}
                <div>
                  <h4 className="font-semibold mb-3">Contributions</h4>
                  <div className="space-y-2">
                    {currentRound.contributions.map((contribution) => (
                      <div
                        key={contribution.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                            {contribution.user.name?.[0] || contribution.user.email[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {contribution.user.name || contribution.user.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {contributionStatusLabels[contribution.status]}
                              {contribution.paidAt && (
                                <span className="ml-1">
                                  • {new Date(contribution.paidAt).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {formatMoney(contribution.amount, tontine.currency)}
                          </span>
                          {contribution.status === 'PAID' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    `/api/tontines/${tontine.id}/contributions/${contribution.id}`,
                                    {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ status: 'PAID' }),
                                    }
                                  );
                                  if (!response.ok) {
                                    throw new Error('Erreur lors de la mise à jour');
                                  }
                                  toast.success('Contribution marquée comme payée');
                                  loadTontine();
                                } catch (error) {
                                  toast.error('Erreur lors de la mise à jour');
                                }
                              }}
                              className="h-7 text-xs"
                            >
                              Marquer payé
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des membres */}
          <Card>
            <CardHeader>
              <CardTitle>Membres</CardTitle>
              <CardDescription>
                Ordre de passage pour recevoir la cagnotte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tontine.members
                  .sort((a, b) => (a.turnOrder || 0) - (b.turnOrder || 0))
                  .map((member, index) => (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        member.hasReceived
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                          #{member.turnOrder}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {member.user.name || member.user.email}
                            {member.user.id === session?.user?.id && (
                              <span className="ml-2 text-xs text-primary">(Vous)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Membre depuis le{' '}
                            {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      {member.hasReceived && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          A reçu
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Actions */}
          {tontine.status === 'DRAFT' && isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleStartTontine}
                  disabled={starting || tontine.members.length < 2}
                >
                  {starting ? (
                    'Démarrage...'
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Démarrer la tontine
                    </>
                  )}
                </Button>
                {tontine.members.length < 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Minimum 2 membres requis
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Code d'invitation */}
          {tontine.status === 'DRAFT' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Inviter des membres
                </CardTitle>
                <CardDescription>
                  Partagez ce code pour inviter d'autres personnes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 rounded-lg bg-muted font-mono text-lg font-bold text-center tracking-wider">
                    {tontine.inviteCode}
                  </code>
                  <Button size="icon" variant="outline" onClick={copyInviteCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Les personnes pourront rejoindre en utilisant ce code dans l'application.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Créateur */}
          <Card>
            <CardHeader>
              <CardTitle>Créateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                  {tontine.creator.name?.[0] || tontine.creator.email[0]}
                </div>
                <div>
                  <p className="font-semibold">{tontine.creator.name || 'Sans nom'}</p>
                  <p className="text-sm text-muted-foreground">{tontine.creator.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

