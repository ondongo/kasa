'use server';

import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function getHouseholdId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const household = await getUserHousehold(session.user.id);
  return household?.id || null;
}

export async function getSavingsBoxes() {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const savingsBoxes = await prisma.savingsBox.findMany({
    where: {
      householdId,
      isRevoked: false,
    },
    include: {
      contributions: {
        orderBy: {
          contributionDate: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convertir les dates en strings pour la sérialisation
  return savingsBoxes.map((box: any) => ({
    ...box,
    dueDate: box.dueDate?.toISOString() || null,
    revokedAt: box.revokedAt?.toISOString() || null,
    createdAt: box.createdAt.toISOString(),
    updatedAt: box.updatedAt.toISOString(),
    contributions: box.contributions.map((c: any) => ({
      ...c,
      contributionDate: c.contributionDate.toISOString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  }));
}

export async function getSavingsBox(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const savingsBox = await prisma.savingsBox.findFirst({
    where: {
      id,
      householdId,
    },
    include: {
      contributions: {
        orderBy: {
          contributionDate: 'desc',
        },
      },
    },
  });

  if (!savingsBox) throw new Error('Caisse d\'épargne introuvable');

  return savingsBox;
}

export async function createSavingsBox(data: {
  name: string;
  description?: string;
  targetAmount: number;
  currency?: string;
  monthlyContribution?: number;
  dueDate?: Date | string;
}) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  if (!data.name || !data.targetAmount || data.targetAmount <= 0) {
    throw new Error('Nom et montant cible sont requis');
  }

  const savingsBox = await prisma.savingsBox.create({
    data: {
      householdId,
      name: data.name,
      description: data.description || null,
      targetAmount: Math.round(data.targetAmount),
      currency: data.currency || 'EUR',
      monthlyContribution: data.monthlyContribution ? Math.round(data.monthlyContribution) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      currentAmount: 0,
    },
    include: {
      contributions: true,
    },
  });

  revalidatePath('/investments/savings-boxes');
  return savingsBox;
}

export async function updateSavingsBox(
  id: string,
  data: {
    name?: string;
    description?: string;
    targetAmount?: number;
    monthlyContribution?: number;
    dueDate?: Date | string | null;
    isRevoked?: boolean;
  }
) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const savingsBox = await prisma.savingsBox.findFirst({
    where: {
      id,
      householdId,
    },
  });

  if (!savingsBox) throw new Error('Caisse d\'épargne introuvable');

  const updated = await prisma.savingsBox.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      targetAmount: data.targetAmount ? Math.round(data.targetAmount) : undefined,
      monthlyContribution: data.monthlyContribution ? Math.round(data.monthlyContribution) : undefined,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : undefined) : undefined,
      isRevoked: data.isRevoked !== undefined ? data.isRevoked : undefined,
      revokedAt: data.isRevoked ? new Date() : undefined,
    },
    include: {
      contributions: true,
    },
  });

  revalidatePath('/investments/savings-boxes');
  return updated;
}

export async function deleteSavingsBox(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const savingsBox = await prisma.savingsBox.findFirst({
    where: {
      id,
      householdId,
    },
  });

  if (!savingsBox) throw new Error('Caisse d\'épargne introuvable');

  await prisma.savingsBox.delete({
    where: { id },
  });

  revalidatePath('/investments/savings-boxes');
}

export async function addContribution(
  savingsBoxId: string,
  data: {
    amount: number;
    contributionDate?: Date | string;
    month?: string;
  }
) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  if (!data.amount || data.amount <= 0) {
    throw new Error('Montant requis');
  }

  const savingsBox = await prisma.savingsBox.findFirst({
    where: {
      id: savingsBoxId,
      householdId,
      isRevoked: false,
    },
  });

  if (!savingsBox) throw new Error('Caisse d\'épargne introuvable ou révoquée');

  const result = await prisma.$transaction(async (tx) => {
    const contribution = await tx.savingsBoxContribution.create({
      data: {
        savingsBoxId,
        amount: Math.round(data.amount),
        contributionDate: data.contributionDate ? new Date(data.contributionDate) : new Date(),
        month: data.month || new Date().toISOString().slice(0, 7),
      },
    });

    await tx.savingsBox.update({
      where: { id: savingsBoxId },
      data: {
        currentAmount: {
          increment: Math.round(data.amount),
        },
      },
    });

    return contribution;
  });

  revalidatePath('/investments/savings-boxes');
  return result;
}

