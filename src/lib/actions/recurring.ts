'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserHousehold } from '../auth';
import { revalidatePath } from 'next/cache';

async function getHouseholdId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const household = await getUserHousehold(session.user.id);
  return household?.id || null;
}

export async function getRecurringTemplates() {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const templates = await prisma.recurringTemplate.findMany({
    where: { householdId },
    orderBy: { createdAt: 'desc' },
  });

  return templates;
}

export async function createRecurringTemplate(data: {
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  label: string;
  amount: number;
  owner: 'ME' | 'PARTNER' | 'SHARED';
  categoryId?: string;
  subcategoryId?: string;
  investmentEnvelopeId?: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startMonth: string;
  endMonth?: string;
}) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const template = await prisma.recurringTemplate.create({
    data: {
      ...data,
      householdId,
    },
  });

  revalidatePath('/dashboard');
  return template;
}

export async function deleteRecurringTemplate(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const template = await prisma.recurringTemplate.findFirst({
    where: {
      id,
      householdId,
    },
  });

  if (!template) {
    throw new Error('Template non trouvé');
  }

  await prisma.recurringTemplate.delete({
    where: { id },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Génère les transactions récurrentes pour un mois donné
 */
export async function generateRecurringTransactions(month: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const monthDate = new Date(month + '-01');

  // Récupérer tous les templates actifs
  const templates = await prisma.recurringTemplate.findMany({
    where: {
      householdId,
      startMonth: { lte: month },
      OR: [
        { endMonth: null },
        { endMonth: { gte: month } },
      ],
    },
  });

  const createdTransactions = [];

  for (const template of templates) {
    // Vérifier si une transaction existe déjà pour ce template ce mois-ci
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        householdId,
        recurringTemplateId: template.id,
        month,
      },
    });

    if (existingTransaction) {
      continue; // Transaction déjà créée
    }

    // Vérifier si le mois correspond à la fréquence
    let shouldCreate = false;
    const startDate = new Date(template.startMonth + '-01');
    const monthsDiff = (monthDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (monthDate.getMonth() - startDate.getMonth());

    switch (template.frequency) {
      case 'MONTHLY':
        shouldCreate = true;
        break;
      case 'QUARTERLY':
        shouldCreate = monthsDiff % 3 === 0;
        break;
      case 'YEARLY':
        shouldCreate = monthsDiff % 12 === 0;
        break;
    }

    if (shouldCreate) {
      const transaction = await prisma.transaction.create({
        data: {
          householdId,
          type: template.type,
          month,
          label: template.label,
          amount: template.amount,
          owner: template.owner,
          categoryId: template.categoryId,
          subcategoryId: template.subcategoryId,
          investmentEnvelopeId: template.investmentEnvelopeId,
          isRecurring: true,
          recurringRule: template.frequency,
          recurringTemplateId: template.id,
        },
      });

      createdTransactions.push(transaction);
    }
  }

  revalidatePath('/dashboard');
  return {
    success: true,
    count: createdTransactions.length,
    transactions: createdTransactions,
  };
}

/**
 * Fonction utilitaire pour générer automatiquement les transactions récurrentes
 * À appeler lors du chargement du dashboard pour le mois en cours
 */
export async function autoGenerateRecurringTransactions(month: string) {
  try {
    await generateRecurringTransactions(month);
  } catch (error) {
    console.error('Erreur lors de la génération automatique des transactions récurrentes:', error);
  }
}

