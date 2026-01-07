import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/savings-boxes/[id] - Récupérer une caisse d'épargne
export async function GET(
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

    const { id } = await params;

    const savingsBox = await prisma.savingsBox.findFirst({
      where: {
        id,
        householdId: household.id,
      },
      include: {
        contributions: {
          orderBy: {
            contributionDate: 'desc',
          },
        },
      },
    });

    if (!savingsBox) {
      return NextResponse.json({ message: 'Caisse d\'épargne introuvable' }, { status: 404 });
    }

    return NextResponse.json(savingsBox);
  } catch (error) {
    console.error('Error fetching savings box:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la caisse d\'épargne' },
      { status: 500 }
    );
  }
}

// PATCH /api/savings-boxes/[id] - Mettre à jour une caisse d'épargne
export async function PATCH(
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

    const { id } = await params;
    const body = await req.json();

    const savingsBox = await prisma.savingsBox.findFirst({
      where: {
        id,
        householdId: household.id,
      },
    });

    if (!savingsBox) {
      return NextResponse.json({ message: 'Caisse d\'épargne introuvable' }, { status: 404 });
    }

    const updated = await prisma.savingsBox.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        targetAmount: body.targetAmount ? parseInt(body.targetAmount) : undefined,
        monthlyContribution: body.monthlyContribution ? parseInt(body.monthlyContribution) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        isRevoked: body.isRevoked !== undefined ? body.isRevoked : undefined,
        revokedAt: body.isRevoked ? new Date() : undefined,
      },
      include: {
        contributions: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating savings box:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la caisse d\'épargne' },
      { status: 500 }
    );
  }
}

// DELETE /api/savings-boxes/[id] - Supprimer une caisse d'épargne
export async function DELETE(
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

    const { id } = await params;

    const savingsBox = await prisma.savingsBox.findFirst({
      where: {
        id,
        householdId: household.id,
      },
    });

    if (!savingsBox) {
      return NextResponse.json({ message: 'Caisse d\'épargne introuvable' }, { status: 404 });
    }

    await prisma.savingsBox.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Caisse d\'épargne supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting savings box:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la caisse d\'épargne' },
      { status: 500 }
    );
  }
}

