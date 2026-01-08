import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { signIn } from 'next-auth/react';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Le token sera automatiquement mis à jour par le callback JWT
    // qui récupère le phoneNumber à jour à chaque requête
    // On retourne simplement un succès pour indiquer que la session est valide
    return NextResponse.json({ 
      success: true,
      message: 'Token mis à jour'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du token:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

