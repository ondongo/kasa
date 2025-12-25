'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TransactionCreateSchema, TransactionUpdateSchema } from '@/lib/zod-schemas';
import { revalidatePath } from 'next/cache';
import { getUserHousehold } from '../auth';

async function getHouseholdId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const household = await getUserHousehold(session.user.id);
  return household?.id || null;
}

export async function getTransactions(month: string, type?: 'INCOME' | 'EXPENSE' | 'INVESTMENT') {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const where: any = {
    householdId,
    month,
  };

  if (type) {
    where.type = type;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
      subcategory: true,
      investmentEnvelope: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return transactions;
}

export async function getTransaction(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      householdId,
    },
    include: {
      category: true,
      subcategory: true,
      investmentEnvelope: true,
    },
  });

  return transaction;
}

export async function createTransaction(data: any) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const validated = TransactionCreateSchema.parse({ ...data, householdId });

  const transaction = await prisma.transaction.create({
    data: validated,
  });

  revalidatePath('/');
  return transaction;
}

export async function updateTransaction(id: string, data: any) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  // Vérifier que la transaction appartient au household
  const existing = await prisma.transaction.findFirst({
    where: { id, householdId },
  });

  if (!existing) throw new Error('Transaction non trouvée');

  const validated = TransactionUpdateSchema.parse({ ...data, id });

  const transaction = await prisma.transaction.update({
    where: { id },
    data: validated,
  });

  revalidatePath('/');
  return transaction;
}

export async function deleteTransaction(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  // Vérifier que la transaction appartient au household
  const existing = await prisma.transaction.findFirst({
    where: { id, householdId },
  });

  if (!existing) throw new Error('Transaction non trouvée');

  await prisma.transaction.delete({
    where: { id },
  });

  revalidatePath('/');
}

