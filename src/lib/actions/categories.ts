'use server';

import { getServerSession } from 'next-auth';
import { authOptions, getUserHousehold } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CategoryCreateSchema, SubcategoryCreateSchema } from '@/lib/zod-schemas';
import { revalidatePath } from 'next/cache';

async function getHouseholdId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const household = await getUserHousehold(session.user.id);
  return household?.id || null;
}

export async function getCategories(type?: 'INCOME' | 'EXPENSE') {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const where: any = { householdId };
  if (type) where.type = type;

  const categories = await prisma.category.findMany({
    where,
    include: {
      subcategories: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  return categories;
}

export async function createCategory(data: any) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const validated = CategoryCreateSchema.parse({ ...data, householdId });

  const category = await prisma.category.create({
    data: validated,
  });

  revalidatePath('/');
  return category;
}

export async function deleteCategory(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  const existing = await prisma.category.findFirst({
    where: { id, householdId },
  });

  if (!existing) throw new Error('Catégorie non trouvée');

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/');
}

export async function createSubcategory(data: any) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  // Vérifier que la catégorie appartient au household
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, householdId },
  });

  if (!category) throw new Error('Catégorie non trouvée');

  const validated = SubcategoryCreateSchema.parse(data);

  const subcategory = await prisma.subcategory.create({
    data: validated,
  });

  revalidatePath('/');
  return subcategory;
}

export async function deleteSubcategory(id: string) {
  const householdId = await getHouseholdId();
  if (!householdId) throw new Error('Non autorisé');

  // Vérifier que la sous-catégorie appartient à une catégorie du household
  const subcategory = await prisma.subcategory.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!subcategory || subcategory.category.householdId !== householdId) {
    throw new Error('Sous-catégorie non trouvée');
  }

  await prisma.subcategory.delete({
    where: { id },
  });

  revalidatePath('/');
}

