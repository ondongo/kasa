import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/tontines/join - Rejoindre une tontine avec un code d'invitation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json(
        { message: 'Code d\'invitation requis' },
        { status: 400 }
      );
    }

    // Trouver la tontine
    const tontine = await prisma.tontine.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
      include: {
        members: true,
      },
    });

    if (!tontine) {
      return NextResponse.json(
        { message: 'Tontine introuvable avec ce code' },
        { status: 404 }
      );
    }

    // Vérifier si la tontine n'est pas annulée ou complétée
    if (tontine.status === 'CANCELLED' || tontine.status === 'COMPLETED') {
      return NextResponse.json(
        { message: 'Cette tontine n\'accepte plus de nouveaux membres' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = tontine.members.find((m) => m.userId === session.user.id);
    if (existingMember) {
      return NextResponse.json(
        { message: 'Vous êtes déjà membre de cette tontine' },
        { status: 400 }
      );
    }

    // Vérifier si la tontine n'est pas pleine
    if (tontine.members.length >= tontine.maxMembers) {
      return NextResponse.json(
        { message: 'Cette tontine a atteint le nombre maximum de membres' },
        { status: 400 }
      );
    }

    // Calculer le prochain ordre de tour
    const maxTurnOrder = Math.max(...tontine.members.map((m) => m.turnOrder || 0), 0);
    const nextTurnOrder = maxTurnOrder + 1;

    // Ajouter l'utilisateur comme membre
    const member = await prisma.tontineMember.create({
      data: {
        tontineId: tontine.id,
        userId: session.user.id,
        status: 'ACTIVE',
        turnOrder: nextTurnOrder,
      },
      include: {
        tontine: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Créer une notification pour le créateur
    await prisma.notification.create({
      data: {
        userId: tontine.creatorId,
        type: 'INFO',
        title: 'Nouveau membre dans votre tontine',
        message: `${session.user.name || session.user.email} a rejoint la tontine "${tontine.name}"`,
        actionUrl: `/tontines/${tontine.id}`,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error joining tontine:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la tentative de rejoindre la tontine' },
      { status: 500 }
    );
  }
}

