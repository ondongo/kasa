import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/tontines/[id]/members/order - Mettre à jour l'ordre des membres
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { id: tontineId } = await params;
    const body = await req.json();
    const { memberOrders } = body; // Array of { memberId: string, turnOrder: number }

    if (!Array.isArray(memberOrders)) {
      return NextResponse.json(
        { message: 'memberOrders doit être un tableau' },
        { status: 400 }
      );
    }

    // Vérifier que la tontine existe
    const tontine = await prisma.tontine.findUnique({
      where: { id: tontineId },
      include: {
        members: true,
      },
    });

    if (!tontine) {
      return NextResponse.json({ message: 'Tontine introuvable' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est le créateur
    if (tontine.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: 'Seul le créateur peut modifier l\'ordre des membres' },
        { status: 403 }
      );
    }

    // Vérifier que la tontine n'est pas démarrée (ou si démarrée, vérifier que les membres n'ont pas déjà reçu)
    if (tontine.status === 'ACTIVE') {
      // Vérifier qu'aucun membre qui change d'ordre n'a déjà reçu ses fonds
      for (const order of memberOrders) {
        const member = tontine.members.find(m => m.id === order.memberId);
        if (member && member.hasReceived) {
          return NextResponse.json(
            { message: 'Impossible de modifier l\'ordre d\'un membre qui a déjà reçu ses fonds' },
            { status: 400 }
          );
        }
      }
    }

    // Mettre à jour l'ordre de chaque membre
    await prisma.$transaction(
      memberOrders.map((order: { memberId: string; turnOrder: number }) =>
        prisma.tontineMember.update({
          where: { id: order.memberId },
          data: { turnOrder: order.turnOrder },
        })
      )
    );

    return NextResponse.json({ message: 'Ordre des membres mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating member order:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de l\'ordre des membres' },
      { status: 500 }
    );
  }
}

