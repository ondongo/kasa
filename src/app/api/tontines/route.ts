import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

// GET /api/tontines - Récupérer toutes les tontines de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const tontines = await prisma.tontine.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            turnOrder: 'asc',
          },
        },
        rounds: {
          orderBy: {
            roundNumber: 'desc',
          },
          take: 1, // Only get the current/latest round
        },
        _count: {
          select: {
            members: true,
            rounds: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format response to include currentRound
    const formattedTontines = tontines.map((tontine) => ({
      ...tontine,
      currentRound: tontine.rounds[0] || null,
      rounds: undefined, // Remove rounds array
    }));

    return NextResponse.json(formattedTontines);
  } catch (error) {
    console.error('Error fetching tontines:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des tontines' },
      { status: 500 }
    );
  }
}

// POST /api/tontines - Créer une nouvelle tontine
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, amount, currency, frequency, maxMembers } = body;

    // Validation
    if (!name || !amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Nom et montant sont requis' },
        { status: 400 }
      );
    }

    if (maxMembers < 2 || maxMembers > 50) {
      return NextResponse.json(
        { message: 'Le nombre de membres doit être entre 2 et 50' },
        { status: 400 }
      );
    }

    // Générer un code d'invitation unique
    const inviteCode = nanoid(10).toUpperCase();

    // Créer la tontine
    const tontine = await prisma.tontine.create({
      data: {
        name,
        description,
        amount: parseInt(amount),
        currency: currency || 'XOF',
        frequency: frequency || 'MONTHLY',
        maxMembers: parseInt(maxMembers),
        inviteCode,
        creatorId: session.user.id,
        status: 'DRAFT',
        members: {
          create: {
            userId: session.user.id,
            status: 'ACTIVE',
            turnOrder: 1,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(tontine, { status: 201 });
  } catch (error) {
    console.error('Error creating tontine:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la tontine' },
      { status: 500 }
    );
  }
}

