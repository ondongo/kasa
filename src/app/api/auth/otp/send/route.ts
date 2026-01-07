import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createVerification } from '@/services/twilio/2fa/createVerification';

export async function POST(req: Request) {
  try {
    const { email, phoneNumber } = await req.json();

    if (!email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Email et numéro de téléphone requis' },
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

    // Envoyer le code OTP via Twilio
    try {
      const verification = await createVerification(phoneNumber);
      
      return NextResponse.json({ 
        success: true,
        status: verification.status,
        message: 'Code de vérification envoyé par SMS'
      });
    } catch (twilioError: any) {
      console.error('Erreur Twilio:', twilioError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du code de vérification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi OTP:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

