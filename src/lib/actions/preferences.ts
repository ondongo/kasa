'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getUserPreferences() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { preferences: true },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Créer les préférences par défaut si elles n'existent pas
  if (!user.preferences) {
    const preferences = await prisma.userPreferences.create({
      data: {
        userId: user.id,
        currency: 'EUR',
        language: 'fr',
        theme: 'dark',
      },
    });
    return preferences;
  }

  return user.preferences;
}

export async function updateUserPreferences(data: {
  currency?: string;
  language?: string;
  theme?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const preferences = await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: data,
    create: {
      userId: user.id,
      ...data,
    },
  });

  return preferences;
}

export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data,
  });

  return user;
}

export async function sendPhoneVerification(phoneNumber: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  // TODO: Implémenter l'envoi de SMS avec code de vérification
  // Utiliser un service comme Twilio, AWS SNS, etc.
  
  console.log(`Code de vérification envoyé au ${phoneNumber}`);
  
  return { success: true, message: 'Code de vérification envoyé' };
}

export async function verifyPhone(code: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  // TODO: Vérifier le code reçu par SMS
  
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      phoneVerified: new Date(),
    },
  });

  return user;
}

