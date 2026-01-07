import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, phoneNumber } = await req.json();

    if (!email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Email et numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le numéro de téléphone de l'utilisateur
    const user = await prisma.user.update({
      where: { email },
      data: { phoneNumber },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Numéro de téléphone mis à jour'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du téléphone:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

