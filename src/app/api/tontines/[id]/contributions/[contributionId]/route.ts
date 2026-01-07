import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/tontines/[id]/contributions/[contributionId] - Marquer une contribution comme payée
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; contributionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { id: tontineId, contributionId } = await params;
    const body = await req.json();
    const { status } = body;

    // Vérifier que la tontine existe
    const tontine = await prisma.tontine.findUnique({
      where: { id: tontineId },
      include: {
        members: true,
        rounds: {
          include: {
            contributions: true,
          },
        },
      },
    });

    if (!tontine) {
      return NextResponse.json({ message: 'Tontine introuvable' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est membre de la tontine
    const isMember = tontine.members.some((m) => m.userId === session.user.id);
    if (!isMember) {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer la contribution
    const contribution = await prisma.tontineContribution.findUnique({
      where: { id: contributionId },
      include: {
        round: true,
      },
    });

    if (!contribution || contribution.tontineId !== tontineId) {
      return NextResponse.json({ message: 'Contribution introuvable' }, { status: 404 });
    }

    // Mettre à jour le statut de la contribution
    const updatedContribution = await prisma.tontineContribution.update({
      where: { id: contributionId },
      data: {
        status: status || 'PAID',
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });

    // Recalculer le montant collecté pour le tour
    const round = contribution.round;
    const allContributions = await prisma.tontineContribution.findMany({
      where: { roundId: round.id },
    });

    const collectedAmount = allContributions
      .filter((c) => c.status === 'PAID')
      .reduce((sum, c) => sum + c.amount, 0);

    // Mettre à jour le montant collecté du tour
    await prisma.tontineRound.update({
      where: { id: round.id },
      data: {
        collectedAmount,
      },
    });

    return NextResponse.json(updatedContribution);
  } catch (error) {
    console.error('Error updating contribution:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la contribution' },
      { status: 500 }
    );
  }
}

