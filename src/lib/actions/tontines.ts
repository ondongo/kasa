'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { ContributionStatus, TontineFrequency } from '@prisma/client';

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function getTontines() {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  const tontines = await prisma.tontine.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          turnOrder: 'asc',
        },
      },
      rounds: {
        orderBy: {
          roundNumber: 'desc',
        },
        take: 1,
      },
      _count: {
        select: {
          members: true,
          rounds: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Format response to include currentRound
    return tontines.map((tontine: any) => ({
    ...tontine,
    currentRound: tontine.rounds[0] || null,
    rounds: undefined,
  }));
}

export async function getTontine(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  const tontine = await prisma.tontine.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          turnOrder: 'asc',
        },
      },
      rounds: {
        include: {
          contributions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          roundNumber: 'desc',
        },
      },
    },
  });

  if (!tontine) throw new Error('Tontine introuvable');

  // Vérifier que l'utilisateur est membre
  const isMember = tontine.members.some((m: any) => m.userId === userId);
  if (!isMember) throw new Error('Accès refusé');

  return tontine;
}

export async function createTontine(data: {
  name: string;
  description?: string;
  amount: number;
  currency?: string;
  frequency?: TontineFrequency;
  maxMembers: number;
}) {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  if (!data.name || !data.amount || data.amount <= 0) {
    throw new Error('Nom et montant sont requis');
  }

  if (data.maxMembers < 2 || data.maxMembers > 50) {
    throw new Error('Le nombre de membres doit être entre 2 et 50');
  }

  const inviteCode = nanoid(10).toUpperCase();

  const tontine = await prisma.tontine.create({
    data: {
      name: data.name,
      description: data.description,
      amount: Math.round(data.amount),
      currency: data.currency || 'XOF',
      frequency: (data.frequency || 'MONTHLY') as TontineFrequency,
      maxMembers: Number(data.maxMembers), // S'assurer que c'est un nombre
      inviteCode,
      creatorId: userId,
      status: 'DRAFT',
      members: {
        create: {
          userId,
          status: 'ACTIVE',
          turnOrder: 1,
        },
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  revalidatePath('/tontines');
  return tontine;
}

export async function deleteTontine(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  const tontine = await prisma.tontine.findUnique({
    where: { id },
  });

  if (!tontine) throw new Error('Tontine introuvable');

  if (tontine.creatorId !== userId) {
    throw new Error('Seul le créateur peut supprimer la tontine');
  }

  if (tontine.status !== 'DRAFT') {
    throw new Error('Impossible de supprimer une tontine déjà démarrée');
  }

  await prisma.tontine.delete({
    where: { id },
  });

  revalidatePath('/tontines');
}

export async function startTontine(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  const tontine = await prisma.tontine.findUnique({
    where: { id },
    include: {
      members: {
        where: { status: 'ACTIVE' },
        orderBy: { turnOrder: 'asc' },
      },
    },
  });

  if (!tontine) throw new Error('Tontine introuvable');

  if (tontine.creatorId !== userId) {
    throw new Error('Seul le créateur peut démarrer la tontine');
  }

  if (tontine.status !== 'DRAFT') {
    throw new Error('La tontine a déjà été démarrée');
  }

  if (tontine.members.length < 2) {
    throw new Error('Minimum 2 membres requis pour démarrer');
  }

  // Calculer la date d'échéance du premier tour
  const now = new Date();
  let dueDate = new Date();

  switch (tontine.frequency) {
    case 'WEEKLY':
      dueDate.setDate(now.getDate() + 7);
      break;
    case 'BIWEEKLY':
      dueDate.setDate(now.getDate() + 14);
      break;
    case 'MONTHLY':
      dueDate.setMonth(now.getMonth() + 1);
      break;
    default:
      dueDate.setMonth(now.getMonth() + 1);
  }

  const result = await prisma.$transaction(async (tx) => {
    // Créer le premier round
    const round = await tx.tontineRound.create({
      data: {
        tontineId: id,
        roundNumber: 1,
        dueDate,
        amount: tontine.amount,
        collectedAmount: 0,
      },
    });

    // Créer les contributions pour tous les membres
    await Promise.all(
      tontine.members.map((member: any) =>
        tx.tontineContribution.create({
          data: {
            roundId: round.id,
            tontineId: id,
            memberId: member.id,
            userId: member.userId,
            amount: tontine.amount,
            status: 'PENDING',
          },
        })
      )
    );

    // Mettre à jour le statut de la tontine
    return await tx.tontine.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        rounds: {
          include: {
            contributions: true,
          },
        },
      },
    });
  });

  revalidatePath('/tontines');
  revalidatePath(`/tontines/${id}`);
  return result;
}

export async function joinTontine(inviteCode: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  const tontine = await prisma.tontine.findUnique({
    where: { inviteCode },
    include: {
      members: true,
    },
  });

  if (!tontine) throw new Error('Code d\'invitation invalide');

  if (tontine.status !== 'DRAFT') {
    throw new Error('Impossible de rejoindre une tontine déjà démarrée');
  }

  if (tontine.members.length >= tontine.maxMembers) {
    throw new Error('La tontine est complète');
  }

  const isAlreadyMember = tontine.members.some((m: any) => m.userId === userId);
  if (isAlreadyMember) {
    throw new Error('Vous êtes déjà membre de cette tontine');
  }

  const newTurnOrder = tontine.members.length + 1;

  const result = await prisma.tontineMember.create({
    data: {
      tontineId: tontine.id,
      userId,
      status: 'ACTIVE',
      turnOrder: newTurnOrder,
    },
    include: {
      tontine: {
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  revalidatePath('/tontines');
  return result.tontine;
}

export async function updateMemberOrder(tontineId: string, memberOrders: Array<{ memberId: string; turnOrder: number }>) {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  if (!Array.isArray(memberOrders)) {
    throw new Error('memberOrders doit être un tableau');
  }

  const tontine = await prisma.tontine.findUnique({
    where: { id: tontineId },
    include: {
      members: true,
    },
  });

  if (!tontine) throw new Error('Tontine introuvable');

  if (tontine.creatorId !== userId) {
    throw new Error('Seul le créateur peut modifier l\'ordre des membres');
  }

  if (tontine.status === 'ACTIVE') {
    for (const order of memberOrders) {
      const member = tontine.members.find((m: any) => m.id === order.memberId);
      if (member && member.hasReceived) {
        throw new Error('Impossible de modifier l\'ordre d\'un membre qui a déjà reçu ses fonds');
      }
    }
  }

  await prisma.$transaction(
    memberOrders.map((order) =>
      prisma.tontineMember.update({
        where: { id: order.memberId },
        data: { turnOrder: order.turnOrder },
      })
    )
  );

  revalidatePath(`/tontines/${tontineId}`);
}

export async function markContributionPaid(tontineId: string, contributionId: string, status: ContributionStatus = 'PAID') {
  const userId = await getUserId();
  if (!userId) throw new Error('Non autorisé');

  const tontine = await prisma.tontine.findUnique({
    where: { id: tontineId },
    include: {
      members: true,
      rounds: {
        include: {
          contributions: true,
        },
      },
    },
  });

  if (!tontine) throw new Error('Tontine introuvable');

  if (tontine.creatorId !== userId) {
    throw new Error('Seul le créateur peut marquer les contributions');
  }

  const contribution = await prisma.tontineContribution.findUnique({
    where: { id: contributionId },
    include: {
      round: true,
    },
  });

  if (!contribution || contribution.tontineId !== tontineId) {
    throw new Error('Contribution introuvable');
  }

  const result = await prisma.$transaction(async (tx) => {
      const updatedContribution = await tx.tontineContribution.update({
      where: { id: contributionId },
      data: {
        status: status,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });

    const round = contribution.round;
      const allContributions = await tx.tontineContribution.findMany({
      where: { roundId: round.id },
    });

    const collectedAmount = allContributions
      .filter((c: any) => c.status === 'PAID')
      .reduce((sum: number, c: any) => sum + c.amount, 0);

    await tx.tontineRound.update({
      where: { id: round.id },
      data: {
        collectedAmount,
      },
    });

    return updatedContribution;
  });

  revalidatePath(`/tontines/${tontineId}`);
  return result;
}

