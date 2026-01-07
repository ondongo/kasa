import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Si pas d'abonnement, créer un essai gratuit de 30 jours
    if (!user.subscription) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);

      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'TRIAL',
          trialEndsAt,
          endDate: trialEndsAt,
        },
      });

      return NextResponse.json(subscription);
    }

    // Vérifier si l'abonnement a expiré
    const now = new Date();
    if (user.subscription.endDate && user.subscription.endDate < now && user.subscription.status === 'ACTIVE') {
      await prisma.subscription.update({
        where: { id: user.subscription.id },
        data: { status: 'EXPIRED' },
      });
      
      return NextResponse.json({ ...user.subscription, status: 'EXPIRED' });
    }

    return NextResponse.json(user.subscription);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

