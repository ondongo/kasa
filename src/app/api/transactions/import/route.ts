import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { eurosToCents } from '@/lib/money';
import Papa from 'papaparse';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const household = await getUserHousehold(session.user.id);
    if (!household) {
      return NextResponse.json({ error: 'Household non trouvé' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: 'Erreur lors du parsing du CSV', details: parsed.errors },
        { status: 400 }
      );
    }

    const errors: any[] = [];
    const successes: any[] = [];

    // Récupérer toutes les catégories et enveloppes pour le mapping
    const [categories, envelopes] = await Promise.all([
      prisma.category.findMany({ where: { householdId: household.id } }),
      prisma.investmentEnvelope.findMany({ where: { householdId: household.id } }),
    ]);

    const categoriesByName = new Map(categories.map((c: any) => [c.name.toLowerCase(), c]));
    const envelopesByName = new Map(envelopes.map((e: any) => [e.name.toLowerCase(), e]));

    for (let i = 0; i < parsed.data.length; i++) {
      const row: any = parsed.data[i];

      try {
        // Validation basique
        if (!row.Type || !row.Mois || !row.Libellé || !row.Montant || !row.Propriétaire) {
          errors.push({ row: i + 1, error: 'Champs requis manquants', data: row });
          continue;
        }

        const type = row.Type.toUpperCase();
        if (!['INCOME', 'EXPENSE', 'INVESTMENT'].includes(type)) {
          errors.push({ row: i + 1, error: 'Type invalide', data: row });
          continue;
        }

        const owner = row.Propriétaire.toUpperCase();
        if (!['ME', 'PARTNER', 'SHARED'].includes(owner)) {
          errors.push({ row: i + 1, error: 'Propriétaire invalide', data: row });
          continue;
        }

        const amount = parseFloat(row.Montant);
        if (isNaN(amount) || amount <= 0) {
          errors.push({ row: i + 1, error: 'Montant invalide', data: row });
          continue;
        }

        // Mapping des catégories et enveloppes
        let categoryId = null;
        let subcategoryId = null;
        let investmentEnvelopeId = null;

        if (row.Catégorie) {
          const cat: any = categoriesByName.get(row.Catégorie.toLowerCase());
          if (cat) {
            categoryId = cat.id;

            // Chercher la sous-catégorie
            if (row['Sous-catégorie']) {
              const subcat: any = await prisma.subcategory.findFirst({
                where: {
                  categoryId: cat.id,
                  name: {
                    equals: row['Sous-catégorie'],
                    mode: 'insensitive',
                  },
                },
              });
              if (subcat) subcategoryId = subcat.id;
            }
          }
        }

        if (row.Enveloppe) {
          const env: any = envelopesByName.get(row.Enveloppe.toLowerCase());
          if (env) investmentEnvelopeId = env.id;
        }

        // Créer la transaction
        const transaction = await prisma.transaction.create({
          data: {
            householdId: household.id,
            type: type as any,
            month: row.Mois,
            label: row.Libellé,
            amount: eurosToCents(amount),
            owner: owner as any,
            categoryId,
            subcategoryId,
            investmentEnvelopeId,
          },
        });

        successes.push({ row: i + 1, transaction });
      } catch (error: any) {
        errors.push({ row: i + 1, error: error.message, data: row });
      }
    }

    return NextResponse.json({
      success: true,
      imported: successes.length,
      errors: errors.length,
      details: { successes, errors },
    });
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'import' }, { status: 500 });
  }
}

