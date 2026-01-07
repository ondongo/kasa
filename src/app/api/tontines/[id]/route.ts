import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/tontines/[id] - Récupérer les détails d'une tontine
export async function GET(
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
          include: {
            contributions: {
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
          orderBy: {
            roundNumber: 'desc',
          },
        },
      },
    });

    if (!tontine) {
      return NextResponse.json({ message: 'Tontine introuvable' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est membre
    const isMember = tontine.members.some((m) => m.userId === session.user.id);
    if (!isMember) {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    return NextResponse.json(tontine);
  } catch (error) {
    console.error('Error fetching tontine:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la tontine' },
      { status: 500 }
    );
  }
}

// DELETE /api/tontines/[id] - Supprimer une tontine (seulement si non démarrée)
export async function DELETE(
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
    });

    if (!tontine) {
      return NextResponse.json({ message: 'Tontine introuvable' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est le créateur
    if (tontine.creatorId !== session.user.id) {
      return NextResponse.json({ message: 'Seul le créateur peut supprimer la tontine' }, { status: 403 });
    }

    // Vérifier que la tontine n'est pas démarrée
    if (tontine.status !== 'DRAFT') {
      return NextResponse.json(
        { message: 'Impossible de supprimer une tontine déjà démarrée' },
        { status: 400 }
      );
    }

    // Supprimer la tontine (cascade supprimera les membres, rounds, contributions)
    await prisma.tontine.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Tontine supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting tontine:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la tontine' },
      { status: 500 }
    );
  }
}

