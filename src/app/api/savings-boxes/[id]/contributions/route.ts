import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/savings-boxes/[id]/contributions - Ajouter une contribution
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const household = await getUserHousehold(session.user.id);
    if (!household) {
      return NextResponse.json({ message: 'Household non trouvé' }, { status: 404 });
    }

    const { id: savingsBoxId } = await params;
    const body = await req.json();
    const { amount, contributionDate, month } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Montant requis' },
        { status: 400 }
      );
    }

    // Vérifier que la caisse d'épargne existe et appartient au household
    const savingsBox = await prisma.savingsBox.findFirst({
      where: {
        id: savingsBoxId,
        householdId: household.id,
        isRevoked: false,
      },
    });

    if (!savingsBox) {
      return NextResponse.json(
        { message: 'Caisse d\'épargne introuvable ou révoquée' },
        { status: 404 }
      );
    }

    // Créer la contribution et mettre à jour le montant actuel
    const result = await prisma.$transaction(async (tx) => {
      const contribution = await tx.savingsBoxContribution.create({
        data: {
          savingsBoxId,
          amount: parseInt(amount),
          contributionDate: contributionDate ? new Date(contributionDate) : new Date(),
          month: month || new Date().toISOString().slice(0, 7), // Format YYYY-MM
        },
      });

      // Mettre à jour le montant actuel
      await tx.savingsBox.update({
        where: { id: savingsBoxId },
        data: {
          currentAmount: {
            increment: parseInt(amount),
          },
        },
      });

      return contribution;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding contribution:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout de la contribution' },
      { status: 500 }
    );
  }
}

