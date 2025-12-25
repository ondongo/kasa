import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/lib/zod-schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Créer l'utilisateur et le household en une transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          password: hashedPassword,
        },
      });

      const household = await tx.household.create({
        data: {
          name: validated.householdName,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          householdId: household.id,
          role: 'OWNER',
          partnerName: validated.name,
        },
      });

      return { user, household };
    });

    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        user: { id: result.user.id, email: result.user.email, name: result.user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}

