'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getTrustedDevices() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      trustedDevices: {
        orderBy: {
          lastUsedAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  return user.trustedDevices;
}

export async function addTrustedDevice(data: {
  name: string;
  deviceType: string;
  userAgent: string;
  ipAddress?: string;
  location?: string;
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

  const device = await prisma.trustedDevice.create({
    data: {
      userId: user.id,
      ...data,
    },
  });

  return device;
}

export async function removeTrustedDevice(deviceId: string) {
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

  // Vérifier que l'appareil appartient à l'utilisateur
  const device = await prisma.trustedDevice.findFirst({
    where: {
      id: deviceId,
      userId: user.id,
    },
  });

  if (!device) {
    throw new Error('Appareil non trouvé');
  }

  await prisma.trustedDevice.delete({
    where: { id: deviceId },
  });

  return { success: true };
}

export async function updateDeviceLastUsed(deviceId: string) {
  await prisma.trustedDevice.update({
    where: { id: deviceId },
    data: {
      lastUsedAt: new Date(),
    },
  });
}

