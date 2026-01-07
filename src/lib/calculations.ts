import { convertCurrency } from './currency-converter';
import { centsToUnits, unitsToCents } from './money';

export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  savings: number;
  savingsRate: number; // Investment rate
  globalSavingsRate: number; // (Income - Expense) / Income
}

/**
 * Calculer le sommaire du budget avec conversion de devises
 * @param transactions - Liste des transactions
 * @param targetCurrency - Devise cible pour les totaux (défaut: EUR)
 * @returns Sommaire avec montants convertis dans la devise cible
 */
export function calculateBudgetSummary(transactions: any[], targetCurrency: string = 'EUR'): BudgetSummary {
  const incomes = transactions.filter((t) => t.type === 'INCOME');
  const expenses = transactions.filter((t) => t.type === 'EXPENSE');
  const investments = transactions.filter((t) => t.type === 'INVESTMENT');

  // Fonction helper pour convertir et sommer
  const sumWithConversion = (items: any[]) => {
    return items.reduce((sum, t) => {
      const sourceCurrency = t.currency || 'EUR';
      
      // Si la devise source et cible sont identiques, pas de conversion
      if (sourceCurrency === targetCurrency) {
        return sum + t.amount;
      }
      
      // Convertir en unités dans la devise source
      const sourceUnits = centsToUnits(t.amount, sourceCurrency);
      
      // Convertir dans la devise cible
      const targetUnits = convertCurrency(sourceUnits, sourceCurrency, targetCurrency);
      
      // Reconvertir en "centimes" pour la devise cible
      const targetCents = unitsToCents(targetUnits, targetCurrency);
      
      return sum + targetCents;
    }, 0);
  };

  const totalIncome = sumWithConversion(incomes);
  const totalExpense = sumWithConversion(expenses);
  const totalInvestment = sumWithConversion(investments);

  const savings = totalIncome - totalExpense - totalInvestment;
  const savingsRate = totalIncome > 0 ? (totalInvestment / totalIncome) * 100 : 0;
  const globalSavingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpense,
    totalInvestment,
    savings,
    savingsRate,
    globalSavingsRate,
  };
}

export interface SankeyNode {
  id: string;
  label: string;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

type TransactionWithRelations = any;

export function buildSankeyData(transactions: TransactionWithRelations[]): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  const incomes = transactions.filter((t) => t.type === 'INCOME');
  const expenses = transactions.filter((t) => t.type === 'EXPENSE');
  const investments = transactions.filter((t) => t.type === 'INVESTMENT');

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalInvestment = investments.reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome === 0) {
    return { nodes: [], links: [] };
  }

  // Node: Revenus
  nodes.push({ id: 'revenus', label: 'Revenus', color: '#10b981' });

  // Nodes et liens: Revenus par catégorie (optionnel)
  const incomesByCategory = new Map<string, number>();
  incomes.forEach((t) => {
    const key = t.category?.name || 'Autres revenus';
    incomesByCategory.set(key, (incomesByCategory.get(key) || 0) + t.amount);
  });

  incomesByCategory.forEach((amount, categoryName) => {
    const nodeId = `income-${categoryName}`;
    if (!nodes.find((n) => n.id === nodeId)) {
      nodes.push({ id: nodeId, label: categoryName, color: '#34d399' });
    }
    links.push({ source: nodeId, target: 'revenus', value: amount, color: '#10b981' });
  });

  // Nodes: Dépenses et Investissements
  if (totalExpense > 0) {
    nodes.push({ id: 'depenses', label: 'Dépenses', color: '#ef4444' });
    links.push({ source: 'revenus', target: 'depenses', value: totalExpense, color: '#ef4444' });
  }

  if (totalInvestment > 0) {
    nodes.push({ id: 'investissements', label: 'Investissements', color: '#3b82f6' });
    links.push({ source: 'revenus', target: 'investissements', value: totalInvestment, color: '#3b82f6' });
  }

  // Détail dépenses par sous-catégorie ou catégorie
  const expensesBySubcategory = new Map<string, { label: string; amount: number; color?: string }>();
  expenses.forEach((t) => {
    const key = t.subcategory?.id || t.category?.id || 'other';
    const label = t.subcategory?.name || t.category?.name || 'Autres dépenses';
    const existing = expensesBySubcategory.get(key);
    if (existing) {
      existing.amount += t.amount;
    } else {
      expensesBySubcategory.set(key, { label, amount: t.amount, color: t.category?.color || undefined });
    }
  });

  expensesBySubcategory.forEach(({ label, amount, color }, key) => {
    const nodeId = `expense-${key}`;
    nodes.push({ id: nodeId, label, color: color || '#fca5a5' });
    links.push({ source: 'depenses', target: nodeId, value: amount, color: '#ef4444' });
  });

  // Détail investissements par enveloppe
  const investmentsByEnvelope = new Map<string, { label: string; amount: number; color?: string }>();
  investments.forEach((t) => {
    const key = t.investmentEnvelope?.id || 'other';
    const label = t.investmentEnvelope?.name || 'Autres investissements';
    const existing = investmentsByEnvelope.get(key);
    if (existing) {
      existing.amount += t.amount;
    } else {
      investmentsByEnvelope.set(key, { label, amount: t.amount, color: t.investmentEnvelope?.color || undefined });
    }
  });

  investmentsByEnvelope.forEach(({ label, amount, color }, key) => {
    const nodeId = `investment-${key}`;
    nodes.push({ id: nodeId, label, color: color || '#93c5fd' });
    links.push({ source: 'investissements', target: nodeId, value: amount, color: '#3b82f6' });
  });

  return { nodes, links };
}

// Gestion des récurrences
export function shouldGenerateRecurringTransaction(
  startMonth: string,
  endMonth: string | null,
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
  targetMonth: string
): boolean {
  if (targetMonth < startMonth) return false;
  if (endMonth && targetMonth > endMonth) return false;

  const [startYear, startMonthNum] = startMonth.split('-').map(Number);
  const [targetYear, targetMonthNum] = targetMonth.split('-').map(Number);

  const monthsDiff = (targetYear - startYear) * 12 + (targetMonthNum - startMonthNum);

  switch (frequency) {
    case 'MONTHLY':
      return true;
    case 'QUARTERLY':
      return monthsDiff % 3 === 0;
    case 'YEARLY':
      return monthsDiff % 12 === 0;
    default:
      return false;
  }
}

export function getNextMonth(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  const nextDate = new Date(year, monthNum, 1); // monthNum is 0-indexed in Date
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth()).padStart(2, '0');
  return `${nextYear}-${nextMonth}`;
}

export function getPreviousMonth(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  const prevDate = new Date(year, monthNum - 2, 1); // -2 because monthNum is 1-indexed, and we want previous
  const prevYear = prevDate.getFullYear();
  const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
  return `${prevYear}-${prevMonth}`;
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

