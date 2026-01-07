import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/tontines/[id]/start - Démarrer une tontine
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const tontine = await prisma.tontine.findUnique({
      where: { id },
      include: {
        members: {
          where: { status: 'ACTIVE' },
          orderBy: { turnOrder: 'asc' },
        },
      },
    });

    if (!tontine) {
      return NextResponse.json({ message: 'Tontine introuvable' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est le créateur
    if (tontine.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: 'Seul le créateur peut démarrer la tontine' },
        { status: 403 }
      );
    }

    // Vérifier que la tontine est en brouillon
    if (tontine.status !== 'DRAFT') {
      return NextResponse.json(
        { message: 'La tontine a déjà été démarrée' },
        { status: 400 }
      );
    }

    // Vérifier qu'il y a au moins 2 membres
    if (tontine.members.length < 2) {
      return NextResponse.json(
        { message: 'Minimum 2 membres requis pour démarrer' },
        { status: 400 }
      );
    }

    // Calculer la date d'échéance du premier tour
    const now = new Date();
    let dueDate = new Date();
    
    switch (tontine.frequency) {
      case 'WEEKLY':
        dueDate.setDate(now.getDate() + 7);
        break;
      case 'BIWEEKLY':
        dueDate.setDate(now.getDate() + 14);
        break;
      case 'MONTHLY':
        dueDate.setMonth(now.getMonth() + 1);
        break;
      default:
        dueDate.setMonth(now.getMonth() + 1);
    }

    // Montant total = montant de contribution × nombre de membres
    const totalAmount = tontine.amount * tontine.members.length;

    // Créer le premier tour
    const firstMember = tontine.members[0];
    await prisma.tontineRound.create({
      data: {
        tontineId: tontine.id,
        roundNumber: 1,
        recipientId: firstMember.userId,
        dueDate,
        amount: totalAmount,
        collectedAmount: 0,
        contributions: {
          create: tontine.members.map((member) => ({
            tontineId: tontine.id,
            memberId: member.id,
            userId: member.userId,
            amount: tontine.amount,
            status: 'PENDING',
          })),
        },
      },
    });

    // Mettre à jour la tontine
    const updatedTontine = await prisma.tontine.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        startDate: now,
      },
    });

    // Créer des notifications pour tous les membres
    await Promise.all(
      tontine.members.map((member) =>
        prisma.notification.create({
          data: {
            userId: member.userId,
            type: 'SUCCESS',
            title: 'Tontine démarrée !',
            message: `La tontine "${tontine.name}" a été démarrée. Le premier tour commence maintenant !`,
            actionUrl: `/tontines/${tontine.id}`,
          },
        })
      )
    );

    return NextResponse.json(updatedTontine);
  } catch (error) {
    console.error('Error starting tontine:', error);
    return NextResponse.json(
      { message: 'Erreur lors du démarrage de la tontine' },
      { status: 500 }
    );
  }
}

