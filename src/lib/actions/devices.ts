'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';

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

export async function addTrustedDevice() {
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

  // Récupérer les headers pour obtenir des infos sur l'appareil
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown';

  // Déterminer le type d'appareil basé sur le user agent
  let deviceType = 'laptop';
  let deviceName = 'Appareil inconnu';

  if (userAgent.toLowerCase().includes('mobile')) {
    deviceType = 'mobile';
    if (userAgent.toLowerCase().includes('iphone')) {
      deviceName = 'iPhone';
    } else if (userAgent.toLowerCase().includes('android')) {
      deviceName = 'Android';
    } else {
      deviceName = 'Mobile';
    }
  } else if (userAgent.toLowerCase().includes('ipad') || userAgent.toLowerCase().includes('tablet')) {
    deviceType = 'tablet';
    deviceName = 'Tablette';
  } else {
    if (userAgent.toLowerCase().includes('mac')) {
      deviceName = 'Mac';
    } else if (userAgent.toLowerCase().includes('windows')) {
      deviceName = 'PC Windows';
    } else if (userAgent.toLowerCase().includes('linux')) {
      deviceName = 'PC Linux';
    } else {
      deviceName = 'Ordinateur';
    }
  }

  // Vérifier si cet appareil existe déjà
  const existingDevice = await prisma.trustedDevice.findFirst({
    where: {
      userId: user.id,
      userAgent,
    },
  });

  if (existingDevice) {
    // Mettre à jour lastUsedAt
    return await prisma.trustedDevice.update({
      where: { id: existingDevice.id },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }

  // Créer un nouvel appareil de confiance
  const device = await prisma.trustedDevice.create({
    data: {
      userId: user.id,
      name: deviceName,
      deviceType,
      userAgent,
      ipAddress,
      location: 'Unknown', // On pourrait utiliser une API de géolocalisation IP
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
  const device = await prisma.trustedDevice.findUnique({
    where: { id: deviceId },
  });

  if (!device || device.userId !== user.id) {
    throw new Error('Appareil non trouvé ou accès refusé');
  }

  await prisma.trustedDevice.delete({
    where: { id: deviceId },
  });

  return { success: true };
}

export async function updateDeviceName(deviceId: string, newName: string) {
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
  const device = await prisma.trustedDevice.findUnique({
    where: { id: deviceId },
  });

  if (!device || device.userId !== user.id) {
    throw new Error('Appareil non trouvé ou accès refusé');
  }

  return await prisma.trustedDevice.update({
    where: { id: deviceId },
    data: { name: newName },
  });
}
