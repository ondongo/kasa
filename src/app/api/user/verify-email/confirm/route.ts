import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token et email requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(email) },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email déjà vérifié' },
        { status: 400 }
      );
    }

    // Pour l'instant, on va utiliser une vérification simple du token
    // Dans un vrai système, vous devriez stocker le token dans la base de données
    // avec une date d'expiration et vérifier qu'il correspond
    
    // Ici, on va simplement vérifier que le token a le bon format
    // et mettre à jour l'email comme vérifié
    // TODO: Implémenter une vraie vérification de token avec une table EmailVerificationToken
    
    // Pour l'instant, on accepte n'importe quel token valide (32+ caractères hex)
    if (token.length < 32) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email vérifié avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la vérification email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

