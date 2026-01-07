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

    // Vérifier que l'utilisateur existe et récupérer son téléphone et préférences
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        trustedDevices: true,
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Si 2FA est activé mais pas de numéro de téléphone, refuser la connexion
    // Note: twoFactorEnabled n'existe pas encore dans le schéma, on vérifie juste le phoneNumber
    const twoFactorEnabled = false; // À activer quand le champ sera ajouté au schéma
    if (twoFactorEnabled && !user.phoneNumber) {
      return NextResponse.json({
        isTrusted: false,
        requiresOTP: true,
        error: '2FA activé mais aucun numéro de téléphone configuré',
      }, { status: 400 });
    }

    // Si 2FA n'est pas activé et pas de numéro de téléphone, permettre la connexion
    if (!twoFactorEnabled && !user.phoneNumber) {
      return NextResponse.json({
        isTrusted: true,
        requiresOTP: false,
        message: '2FA non activé et aucun numéro de téléphone configuré',
      });
    }

    // Si 2FA est activé, toujours demander OTP si appareil non fiable
    if (twoFactorEnabled) {
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
        message: '2FA activé - Appareil non reconnu, vérification requise',
      });
    }

    // Si 2FA n'est pas activé, vérifier quand même les appareils de confiance
    // TOUJOURS demander OTP si première connexion (aucun appareil de confiance) ou appareil non reconnu
    const isFirstConnection = user.trustedDevices.length === 0;
    
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

    // Si première connexion, toujours demander OTP
    if (isFirstConnection) {
      if (!user.phoneNumber) {
        return NextResponse.json({
          isTrusted: false,
          requiresOTP: false,
          message: 'Première connexion - Veuillez configurer un numéro de téléphone',
        });
      }
      return NextResponse.json({
        isTrusted: false,
        requiresOTP: true,
        phoneNumber: user.phoneNumber,
        message: 'Première connexion - Vérification requise',
      });
    }

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

    // Appareil non reconnu, OTP requis (toujours demander si pas de trusted device)
    if (!user.phoneNumber) {
      return NextResponse.json({
        isTrusted: false,
        requiresOTP: false,
        message: 'Appareil non reconnu - Veuillez configurer un numéro de téléphone',
      });
    }

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

