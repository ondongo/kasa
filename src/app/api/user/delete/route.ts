import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { password, confirmation } = await req.json();

    if (!password || confirmation !== 'SUPPRIMER') {
      return NextResponse.json(
        { error: 'Mot de passe et confirmation requis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier le mot de passe (seulement si l'utilisateur a un mot de passe)
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Mot de passe incorrect' },
          { status: 400 }
        );
      }
    }

    // Supprimer l'utilisateur (cascade delete des relations grâce au schema)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Compte supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du compte' },
      { status: 500 }
    );
  }
}

