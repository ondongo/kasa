import { z } from 'zod';

// Enums
export const TransactionTypeEnum = z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']);
export const OwnerEnum = z.enum(['ME', 'PARTNER', 'SHARED']);
export const RecurringFrequencyEnum = z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']);
export const RoleEnum = z.enum(['OWNER', 'MEMBER']);

// Transaction schema
export const TransactionSchema = z.object({
  id: z.string().optional(),
  householdId: z.string(),
  type: TransactionTypeEnum,
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Format doit être YYYY-MM'),
  label: z.string().min(1, 'Le libellé est requis').max(200),
  amount: z.number().int().positive('Le montant doit être positif'),
  owner: OwnerEnum,
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),
  investmentEnvelopeId: z.string().nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurringRule: RecurringFrequencyEnum.nullable().optional(),
  startMonth: z.string().regex(/^\d{4}-\d{2}$/).nullable().optional(),
  endMonth: z.string().regex(/^\d{4}-\d{2}$/).nullable().optional(),
});

export const TransactionCreateSchema = TransactionSchema.omit({ id: true });
export const TransactionUpdateSchema = TransactionSchema.partial().required({ id: true });

// Category schema
export const CategorySchema = z.object({
  id: z.string().optional(),
  householdId: z.string(),
  name: z.string().min(1, 'Le nom est requis').max(100),
  type: TransactionTypeEnum,
  color: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export const CategoryCreateSchema = CategorySchema.omit({ id: true });
export const CategoryUpdateSchema = CategorySchema.partial().required({ id: true });

// Subcategory schema
export const SubcategorySchema = z.object({
  id: z.string().optional(),
  categoryId: z.string(),
  name: z.string().min(1, 'Le nom est requis').max(100),
  order: z.number().int().default(0),
});

export const SubcategoryCreateSchema = SubcategorySchema.omit({ id: true });
export const SubcategoryUpdateSchema = SubcategorySchema.partial().required({ id: true });

// Investment envelope schema
export const InvestmentEnvelopeSchema = z.object({
  id: z.string().optional(),
  householdId: z.string(),
  name: z.string().min(1, 'Le nom est requis').max(100),
  color: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export const InvestmentEnvelopeCreateSchema = InvestmentEnvelopeSchema.omit({ id: true });
export const InvestmentEnvelopeUpdateSchema = InvestmentEnvelopeSchema.partial().required({ id: true });

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  householdName: z.string().min(2, 'Le nom du foyer est requis'),
});

// CSV Import schema
export const CSVRowSchema = z.object({
  type: TransactionTypeEnum,
  month: z.string().regex(/^\d{4}-\d{2}$/),
  label: z.string(),
  amount: z.number().positive(),
  owner: OwnerEnum,
  category: z.string().optional(),
  subcategory: z.string().optional(),
  envelope: z.string().optional(),
});

// Types
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type SubcategoryInput = z.infer<typeof SubcategorySchema>;
export type InvestmentEnvelopeInput = z.infer<typeof InvestmentEnvelopeSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CSVRowInput = z.infer<typeof CSVRowSchema>;

