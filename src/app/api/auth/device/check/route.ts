import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDeviceFingerprint } from '@/lib/device-detector';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe et récupérer son téléphone
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        phoneNumber: true,
        trustedDevices: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Si l'utilisateur n'a pas de numéro de téléphone, impossible de vérifier
    if (!user.phoneNumber) {
      return NextResponse.json({
        isTrusted: true,
        requiresOTP: false,
        message: 'Aucun numéro de téléphone configuré',
      });
    }

    // Récupérer les informations de l'appareil actuel
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('x-real-ip') || 
                      'Unknown';

    const fingerprint = generateDeviceFingerprint(userAgent, ipAddress);

    // Vérifier si l'appareil est dans la liste des appareils de confiance
    const trustedDevice = user.trustedDevices.find(device => 
      device.userAgent.includes(`fingerprint:${fingerprint}`)
    );

    if (trustedDevice) {
      // Mettre à jour la dernière utilisation
      await prisma.trustedDevice.update({
        where: { id: trustedDevice.id },
        data: { lastUsedAt: new Date() },
      });

      return NextResponse.json({
        isTrusted: true,
        requiresOTP: false,
        deviceName: trustedDevice.name,
      });
    }

    // Appareil non reconnu, OTP requis
    return NextResponse.json({
      isTrusted: false,
      requiresOTP: true,
      phoneNumber: user.phoneNumber,
      message: 'Appareil non reconnu, vérification requise',
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'appareil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

