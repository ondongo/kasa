'use server';

import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { InvestmentEnvelopeCreateSchema } from '@/lib/zod-schemas';
import { revalidatePath } from 'next/cache';

async function getHouseholdId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const household = await getUserHousehold(session.user.id);
  return household?.id || null;
}

export async function getEnvelopes() {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const envelopes = await prisma.investmentEnvelope.findMany({
    where: { householdId },
    orderBy: { order: 'asc' },
  });

  return envelopes;
}

export async function createEnvelope(data: any) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const validated = InvestmentEnvelopeCreateSchema.parse({ ...data, householdId });

  const envelope = await prisma.investmentEnvelope.create({
    data: validated,
  });

  revalidatePath('/');
  return envelope;
}

export async function deleteEnvelope(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const existing = await prisma.investmentEnvelope.findFirst({
    where: { id, householdId },
  });

  if (!existing) throw new Error('Enveloppe non trouvée');

  await prisma.investmentEnvelope.delete({
    where: { id },
  });

  revalidatePath('/');
}

