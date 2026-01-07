import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/savings-boxes - Récupérer toutes les caisses d'épargne
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const household = await getUserHousehold(session.user.id);
    if (!household) {
      return NextResponse.json({ message: 'Household non trouvé' }, { status: 404 });
    }

    // @ts-expect-error - Prisma client needs to be regenerated after migration
    const savingsBoxes = await prisma.savingsBox.findMany({
      where: {
        householdId: household.id,
        isRevoked: false,
      },
      include: {
        contributions: {
          orderBy: {
            contributionDate: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(savingsBoxes);
  } catch (error) {
    console.error('Error fetching savings boxes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des caisses d\'épargne' },
      { status: 500 }
    );
  }
}

// POST /api/savings-boxes - Créer une nouvelle caisse d'épargne
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const household = await getUserHousehold(session.user.id);
    if (!household) {
      return NextResponse.json({ message: 'Household non trouvé' }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, targetAmount, currency, monthlyContribution, dueDate } = body;

    if (!name || !targetAmount || targetAmount <= 0) {
      return NextResponse.json(
        { message: 'Nom et montant cible sont requis' },
        { status: 400 }
      );
    }

    // @ts-expect-error - Prisma client needs to be regenerated after migration
    const savingsBox = await prisma.savingsBox.create({
      data: {
        householdId: household.id,
        name,
        description,
        targetAmount: parseInt(targetAmount),
        currency: currency || 'EUR',
        monthlyContribution: monthlyContribution ? parseInt(monthlyContribution) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        currentAmount: 0,
      },
      include: {
        contributions: true,
      },
    });

    return NextResponse.json(savingsBox, { status: 201 });
  } catch (error) {
    console.error('Error creating savings box:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la caisse d\'épargne' },
      { status: 500 }
    );
  }
}

