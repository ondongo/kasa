import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createVerificationCheck } from '@/services/twilio/2fa/checkVerification';
import { detectDevice, generateDeviceFingerprint } from '@/lib/device-detector';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, phoneNumber, code } = await req.json();

    if (!email || !phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le code OTP via Twilio
    try {
      const verificationCheck = await createVerificationCheck(phoneNumber, code);
      
      if (verificationCheck.status !== 'approved') {
        return NextResponse.json(
          { error: 'Code de vérification invalide' },
          { status: 400 }
        );
      }

      // Code valide, ajouter l'appareil aux appareils de confiance
      const headersList = await headers();
      const userAgent = headersList.get('user-agent') || 'Unknown';
      const ipAddress = headersList.get('x-forwarded-for') || 
                        headersList.get('x-real-ip') || 
                        'Unknown';

      const deviceInfo = detectDevice(userAgent);
      const fingerprint = generateDeviceFingerprint(userAgent, ipAddress);

      // Vérifier si l'appareil existe déjà (par fingerprint)
      const existingDevice = await prisma.trustedDevice.findFirst({
        where: {
          userId: user.id,
          userAgent: { contains: fingerprint },
        },
      });

      if (!existingDevice) {
        // Créer un nouvel appareil de confiance
        await prisma.trustedDevice.create({
          data: {
            userId: user.id,
            name: deviceInfo.deviceName,
            deviceType: deviceInfo.deviceType,
            userAgent: `${userAgent}|fingerprint:${fingerprint}`,
            ipAddress,
            location: 'Unknown', // On pourrait utiliser une API de géolocalisation
          },
        });
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Appareil vérifié et ajouté aux appareils de confiance'
      });
    } catch (twilioError: any) {
      console.error('Erreur Twilio:', twilioError);
      return NextResponse.json(
        { error: 'Code de vérification invalide' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la vérification OTP:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

