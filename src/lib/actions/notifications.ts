'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications(unreadOnly = false) {
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

  const where: any = { userId: user.id };
  if (unreadOnly) {
    where.read = false;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50, // Limiter à 50 notifications
  });

  return notifications;
}

export async function getUnreadCount() {
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

  const count = await prisma.notification.count({
    where: {
      userId: user.id,
      read: false,
    },
  });

  return count;
}

export async function createNotification(data: {
  userId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  actionUrl?: string;
}) {
  const notification = await prisma.notification.create({
    data,
  });

  revalidatePath('/dashboard');
  return notification;
}

export async function markAsRead(notificationId: string) {
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

  // Vérifier que la notification appartient à l'utilisateur
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId: user.id,
    },
  });

  if (!notification) {
    throw new Error('Notification non trouvée');
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function markAllAsRead() {
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

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false,
    },
    data: { read: true },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteNotification(notificationId: string) {
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

  // Vérifier que la notification appartient à l'utilisateur
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId: user.id,
    },
  });

  if (!notification) {
    throw new Error('Notification non trouvée');
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Fonction utilitaire pour créer des notifications système
 */
export async function notifyUser(
  userId: string,
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
  title: string,
  message: string,
  actionUrl?: string
) {
  try {
    await createNotification({
      userId,
      type,
      title,
      message,
      actionUrl,
    });
  } catch (error) {
    console.error('Erreur lors de la création de notification:', error);
  }
}

