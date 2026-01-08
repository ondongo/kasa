'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Coins, Share2, Play, CheckCircle2, Clock, Copy, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import { formatMoney } from '@/lib/money';
import { TontineDetailSkeleton } from '@/components/skeletons/TontineDetailSkeleton';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Composant pour un membre triable
function SortableMemberItem({
  member,
  isCreator,
  sessionUserId,
}: {
  member: {
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
  };
  isCreator: boolean;
  sessionUserId?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id, disabled: member.hasReceived || !isCreator });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-lg ${
        member.hasReceived
          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
          : 'bg-muted/50'
      } ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        {isCreator && !member.hasReceived && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold shrink-0">
          #{member.turnOrder}
        </div>
        <div className="flex-1">
          <p className="font-semibold">
            {member.user.name || member.user.email}
            {member.user.id === sessionUserId && (
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
  );
}

export default function TontineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tontine, setTontine] = useState<TontineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [members, setMembers] = useState<Array<{
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
  }>>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadTontine = async () => {
    try {
      const { getTontine } = await import('@/lib/actions/tontines');
      const data = await getTontine(params.id as string);
      
      // Convertir les dates en strings pour la compatibilité avec le state
      const formattedData = {
        ...data,
        createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt,
        startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
        members: (data.members || []).map((m: any) => ({
          ...m,
          joinedAt: m.joinedAt instanceof Date ? m.joinedAt.toISOString() : m.joinedAt,
          status: String(m.status),
        })),
        rounds: (data.rounds || []).map((r: any) => ({
          ...r,
          dueDate: r.dueDate instanceof Date ? r.dueDate.toISOString() : r.dueDate,
          paidAt: r.paidAt instanceof Date ? r.paidAt.toISOString() : r.paidAt,
          contributions: (r.contributions || []).map((c: any) => ({
            ...c,
            paidAt: c.paidAt instanceof Date ? c.paidAt.toISOString() : c.paidAt,
            status: String(c.status),
          })),
        })),
      };
      
      setTontine(formattedData as any);
      // Initialiser les membres triés par turnOrder
      setMembers([...formattedData.members].sort((a: any, b: any) => (a.turnOrder || 0) - (b.turnOrder || 0)));
    } catch (error: any) {
      if (error.message?.includes('introuvable') || error.message?.includes('Accès refusé')) {
        toast.error('Tontine introuvable');
        router.push('/tontines');
        return;
      }
      toast.error(error.message || 'Erreur lors du chargement de la tontine');
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
      const { startTontine } = await import('@/lib/actions/tontines');
      await startTontine(tontine.id);
      toast.success('Tontine démarrée avec succès !');
      loadTontine();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du démarrage');
      console.error(error);
    } finally {
      setStarting(false);
    }
  };

  const handleDeleteTontine = async () => {
    if (!tontine) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tontine ? Cette action est irréversible.')) {
      return;
    }
    try {
      const { deleteTontine } = await import('@/lib/actions/tontines');
      await deleteTontine(tontine.id);
      toast.success('Tontine supprimée avec succès');
      router.push('/tontines');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
      console.error(error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !tontine) {
      return;
    }

    const isCreator = tontine.creator.id === session?.user?.id;
    if (!isCreator) {
      return;
    }

    const oldIndex = members.findIndex((m) => m.id === active.id);
    const newIndex = members.findIndex((m) => m.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Vérifier qu'aucun membre déplacé n'a déjà reçu ses fonds
    const movedMember = members[oldIndex];
    if (movedMember.hasReceived) {
      toast.error('Impossible de déplacer un membre qui a déjà reçu ses fonds');
      return;
    }

    // Mettre à jour l'ordre localement
    const newMembers = arrayMove(members, oldIndex, newIndex);
    setMembers(newMembers);

    // Mettre à jour les turnOrder
    const memberOrders = newMembers.map((member, index) => ({
      memberId: member.id,
      turnOrder: index + 1,
    }));

    try {
      const { updateMemberOrder } = await import('@/lib/actions/tontines');
      await updateMemberOrder(tontine.id, memberOrders);

      toast.success('Ordre des membres mis à jour');
      loadTontine(); // Recharger pour avoir les données à jour
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'ordre');
      // Restaurer l'ordre précédent en cas d'erreur
      setMembers([...tontine.members].sort((a, b) => (a.turnOrder || 0) - (b.turnOrder || 0)));
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
                          ) : isCreator ? (
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
                                    const error = await response.json();
                                    throw new Error(error.message || 'Erreur lors de la mise à jour');
                                  }
                                  toast.success('Contribution marquée comme payée');
                                  loadTontine();
                                } catch (error: any) {
                                  toast.error(error.message || 'Erreur lors de la mise à jour');
                                }
                              }}
                              className="h-7 text-xs"
                            >
                              Marquer payé
                            </Button>
                          ) : (
                            <Clock className="h-4 w-4 text-amber-600" />
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
              {isCreator && tontine.status === 'DRAFT' && (
                <p className="text-sm text-muted-foreground mb-3">
                  Glissez-déposez les membres pour modifier l'ordre (sauf ceux qui ont déjà reçu)
                </p>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={members.map(m => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {members.map((member) => (
                      <SortableMemberItem
                        key={member.id}
                        member={member}
                        isCreator={isCreator}
                        sessionUserId={session?.user?.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteTontine}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer la tontine
                </Button>
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

