import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { centsToUnits } from '@/lib/money';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const household = await getUserHousehold(session.user.id);
    if (!household) {
      return NextResponse.json({ error: 'Household non trouvé' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const startMonth = searchParams.get('startMonth');
    const endMonth = searchParams.get('endMonth');

    const where: any = { householdId: household.id };

    if (month) {
      where.month = month;
    } else if (startMonth && endMonth) {
      where.month = {
        gte: startMonth,
        lte: endMonth,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        subcategory: true,
        investmentEnvelope: true,
      },
      orderBy: { month: 'asc' },
    });

    // Générer CSV
    const csvHeader = 'Type,Mois,Libellé,Montant,Propriétaire,Catégorie,Sous-catégorie,Enveloppe\n';
    const csvRows = transactions.map((t: any) => {
      const amount = centsToUnits(t.amount);
      const category = t.category?.name || '';
      const subcategory = t.subcategory?.name || '';
      const envelope = t.investmentEnvelope?.name || '';

      return `${t.type},${t.month},"${t.label}",${amount},${t.owner},"${category}","${subcategory}","${envelope}"`;
    });

    const csv = csvHeader + csvRows.join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${month || 'export'}.csv"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'export' }, { status: 500 });
  }
}

