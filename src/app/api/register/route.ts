import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/lib/zod-schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, householdName, phoneNumber, region } = body;

    if (!email || !password || !name || !householdName) {
      return NextResponse.json(
        { error: 'Email, mot de passe, nom et nom du foyer sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur, household et préférences en une transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          phoneNumber: phoneNumber || null,
        },
      });

      // Déterminer la devise par défaut selon la région
      let defaultCurrency = 'EUR';
      if (region === 'AFRICA') {
        defaultCurrency = 'XOF'; // Franc CFA (peut être changé en XAF selon le pays)
      } else if (region === 'EUROPE') {
        defaultCurrency = 'EUR';
      } else if (region === 'AMERICA') {
        defaultCurrency = 'USD';
      }

      // Créer les préférences par défaut
      await tx.userPreferences.create({
        data: {
          userId: user.id,
          currency: defaultCurrency,
          language: 'fr',
          theme: 'dark',
        },
      });

      const household = await tx.household.create({
        data: {
          name: householdName,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          householdId: household.id,
          role: 'OWNER',
          partnerName: name,
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

