import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début du seed...');

  // Nettoyer la base de données
  await prisma.transaction.deleteMany();
  await prisma.recurringTemplate.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.investmentEnvelope.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.household.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de données nettoyée');

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@kasa.fr',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Utilisateur créé:', user.email);

  // Créer un household
  const household = await prisma.household.create({
    data: {
      name: 'Foyer Demo',
    },
  });

  console.log('✅ Household créé:', household.name);

  // Créer une membership
  await prisma.membership.create({
    data: {
      userId: user.id,
      householdId: household.id,
      role: 'OWNER',
      partnerName: 'Moi',
    },
  });

  console.log('✅ Membership créée');

  // Créer les catégories de revenus
  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Salaire',
        type: 'INCOME',
        color: '#10b981',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Revenu complémentaire',
        type: 'INCOME',
        color: '#34d399',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Aides',
        type: 'INCOME',
        color: '#6ee7b7',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Avantages',
        type: 'INCOME',
        color: '#a7f3d0',
        order: 4,
      },
    }),
  ]);

  console.log('✅ Catégories de revenus créées');

  // Créer les catégories de dépenses
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Logement',
        type: 'EXPENSE',
        color: '#ef4444',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Vie quotidienne',
        type: 'EXPENSE',
        color: '#f97316',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Transport',
        type: 'EXPENSE',
        color: '#f59e0b',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Abonnements',
        type: 'EXPENSE',
        color: '#eab308',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Loisirs',
        type: 'EXPENSE',
        color: '#84cc16',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        householdId: household.id,
        name: 'Divers',
        type: 'EXPENSE',
        color: '#6b7280',
        order: 6,
      },
    }),
  ]);

  console.log('✅ Catégories de dépenses créées');

  // Créer les sous-catégories
  const subcategories = await Promise.all([
    // Logement
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[0].id,
        name: 'Loyer',
        order: 1,
      },
    }),
    // Vie quotidienne
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[1].id,
        name: 'Courses',
        order: 1,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[1].id,
        name: 'Restaurants',
        order: 2,
      },
    }),
    // Transport
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[2].id,
        name: 'Transport',
        order: 1,
      },
    }),
    // Abonnements
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[3].id,
        name: 'Internet/Téléphone',
        order: 1,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[3].id,
        name: 'Netflix',
        order: 2,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[3].id,
        name: 'GPT/Cursor',
        order: 3,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[3].id,
        name: 'UberEats',
        order: 4,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[3].id,
        name: 'Cloud',
        order: 5,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[3].id,
        name: 'SetApp',
        order: 6,
      },
    }),
    // Loisirs
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[4].id,
        name: 'Sport',
        order: 1,
      },
    }),
    // Divers
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[5].id,
        name: 'Remboursement',
        order: 1,
      },
    }),
    prisma.subcategory.create({
      data: {
        categoryId: expenseCategories[5].id,
        name: 'Divers',
        order: 2,
      },
    }),
  ]);

  console.log('✅ Sous-catégories créées');

  // Créer les enveloppes d'investissement
  const envelopes = await Promise.all([
    prisma.investmentEnvelope.create({
      data: {
        householdId: household.id,
        name: 'Actions',
        color: '#3b82f6',
        order: 1,
      },
    }),
    prisma.investmentEnvelope.create({
      data: {
        householdId: household.id,
        name: 'Livret A',
        color: '#60a5fa',
        order: 2,
      },
    }),
    prisma.investmentEnvelope.create({
      data: {
        householdId: household.id,
        name: 'Livret LEP',
        color: '#93c5fd',
        order: 3,
      },
    }),
    prisma.investmentEnvelope.create({
      data: {
        householdId: household.id,
        name: 'Revolut',
        color: '#bfdbfe',
        order: 4,
      },
    }),
    prisma.investmentEnvelope.create({
      data: {
        householdId: household.id,
        name: 'Revolut imprévu',
        color: '#dbeafe',
        order: 5,
      },
    }),
  ]);

  console.log('✅ Enveloppes d\'investissement créées');

  // Créer les transactions pour le mois en cours (décembre 2024)
  const currentMonth = '2024-12';

  // Revenus
  const incomeTransactions = [
    {
      type: 'INCOME' as const,
      label: 'Salaire',
      amount: 139400, // 1394€ en centimes
      categoryId: incomeCategories[0].id,
      owner: 'ME' as const,
    },
    {
      type: 'INCOME' as const,
      label: 'Revenu complémentaire',
      amount: 150000, // 1500€
      categoryId: incomeCategories[1].id,
      owner: 'PARTNER' as const,
    },
    {
      type: 'INCOME' as const,
      label: 'CAF',
      amount: 20200, // 202€
      categoryId: incomeCategories[2].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'INCOME' as const,
      label: 'Ticket resto',
      amount: 10100, // 101€
      categoryId: incomeCategories[3].id,
      owner: 'ME' as const,
    },
  ];

  // Dépenses
  const expenseTransactions = [
    {
      type: 'EXPENSE' as const,
      label: 'Loyer',
      amount: 45000, // 450€
      categoryId: expenseCategories[0].id,
      subcategoryId: subcategories[0].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Courses',
      amount: 30000, // 300€
      categoryId: expenseCategories[1].id,
      subcategoryId: subcategories[1].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Restaurants',
      amount: 10000, // 100€
      categoryId: expenseCategories[1].id,
      subcategoryId: subcategories[2].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Transport',
      amount: 15400, // 154€
      categoryId: expenseCategories[2].id,
      subcategoryId: subcategories[3].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Internet/Téléphone',
      amount: 2000, // 20€
      categoryId: expenseCategories[3].id,
      subcategoryId: subcategories[4].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Netflix',
      amount: 1000, // 10€
      categoryId: expenseCategories[3].id,
      subcategoryId: subcategories[5].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'GPT/Cursor',
      amount: 2000, // 20€
      categoryId: expenseCategories[3].id,
      subcategoryId: subcategories[6].id,
      owner: 'ME' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'UberEats',
      amount: 600, // 6€
      categoryId: expenseCategories[3].id,
      subcategoryId: subcategories[7].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Cloud',
      amount: 200, // 2€
      categoryId: expenseCategories[3].id,
      subcategoryId: subcategories[8].id,
      owner: 'ME' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'SetApp',
      amount: 2000, // 20€
      categoryId: expenseCategories[3].id,
      subcategoryId: subcategories[9].id,
      owner: 'ME' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Sport',
      amount: 3000, // 30€
      categoryId: expenseCategories[4].id,
      subcategoryId: subcategories[10].id,
      owner: 'ME' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Remboursement',
      amount: 10000, // 100€
      categoryId: expenseCategories[5].id,
      subcategoryId: subcategories[11].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'EXPENSE' as const,
      label: 'Divers',
      amount: 8500, // 85€
      categoryId: expenseCategories[5].id,
      subcategoryId: subcategories[12].id,
      owner: 'SHARED' as const,
    },
  ];

  // Investissements
  const investmentTransactions = [
    {
      type: 'INVESTMENT' as const,
      label: 'Actions',
      amount: 10000, // 100€
      investmentEnvelopeId: envelopes[0].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'INVESTMENT' as const,
      label: 'Livret A',
      amount: 50000, // 500€
      investmentEnvelopeId: envelopes[1].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'INVESTMENT' as const,
      label: 'Livret LEP',
      amount: 100000, // 1000€
      investmentEnvelopeId: envelopes[2].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'INVESTMENT' as const,
      label: 'Revolut',
      amount: 20000, // 200€
      investmentEnvelopeId: envelopes[3].id,
      owner: 'SHARED' as const,
    },
    {
      type: 'INVESTMENT' as const,
      label: 'Revolut imprévu',
      amount: 10000, // 100€
      investmentEnvelopeId: envelopes[4].id,
      owner: 'SHARED' as const,
    },
  ];

  const allTransactions = [
    ...incomeTransactions.map((t) => ({ ...t, month: currentMonth, householdId: household.id })),
    ...expenseTransactions.map((t) => ({ ...t, month: currentMonth, householdId: household.id })),
    ...investmentTransactions.map((t) => ({ ...t, month: currentMonth, householdId: household.id })),
  ];

  await Promise.all(
    allTransactions.map((t) =>
      prisma.transaction.create({
        data: t,
      })
    )
  );

  console.log('✅ Transactions créées');

  // Calculs de vérification
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalInvestment = investmentTransactions.reduce((sum, t) => sum + t.amount, 0);

  console.log('\n📊 Résumé du budget:');
  console.log(`Revenus totaux: ${(totalIncome / 100).toFixed(2)} €`);
  console.log(`Dépenses totales: ${(totalExpense / 100).toFixed(2)} €`);
  console.log(`Investissements totaux: ${(totalInvestment / 100).toFixed(2)} €`);
  console.log(`Taux d'épargne: ${((totalInvestment / totalIncome) * 100).toFixed(2)} %`);
  console.log(`Reste: ${((totalIncome - totalExpense - totalInvestment) / 100).toFixed(2)} €`);

  console.log('\n✅ Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

