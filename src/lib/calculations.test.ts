import { calculateBudgetSummary, shouldGenerateRecurringTransaction, getCurrentMonth } from './calculations';

describe('calculateBudgetSummary', () => {
  it('should calculate budget summary correctly', () => {
    const transactions = [
      { type: 'INCOME', amount: 319700 } as any, // 3197€
      { type: 'EXPENSE', amount: 129700 } as any, // 1297€
      { type: 'INVESTMENT', amount: 190000 } as any, // 1900€
    ];

    const summary = calculateBudgetSummary(transactions);

    expect(summary.totalIncome).toBe(319700);
    expect(summary.totalExpense).toBe(129700);
    expect(summary.totalInvestment).toBe(190000);
    expect(summary.savings).toBe(0); // 3197 - 1297 - 1900 = 0
    expect(summary.savingsRate).toBeCloseTo(59.43, 1); // (1900 / 3197) * 100
    expect(summary.globalSavingsRate).toBeCloseTo(59.43, 1);
  });

  it('should handle zero income', () => {
    const transactions = [
      { type: 'EXPENSE', amount: 100000 } as any,
    ];

    const summary = calculateBudgetSummary(transactions);

    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpense).toBe(100000);
    expect(summary.savingsRate).toBe(0);
    expect(summary.globalSavingsRate).toBe(0);
  });
});

describe('shouldGenerateRecurringTransaction', () => {
  it('should generate monthly recurring transaction', () => {
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'MONTHLY', '2024-01')).toBe(true);
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'MONTHLY', '2024-02')).toBe(true);
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'MONTHLY', '2024-12')).toBe(true);
  });

  it('should generate quarterly recurring transaction', () => {
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'QUARTERLY', '2024-01')).toBe(true);
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'QUARTERLY', '2024-02')).toBe(false);
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'QUARTERLY', '2024-04')).toBe(true);
    expect(shouldGenerateRecurringTransaction('2024-01', null, 'QUARTERLY', '2024-07')).toBe(true);
  });

  it('should respect end month', () => {
    expect(shouldGenerateRecurringTransaction('2024-01', '2024-06', 'MONTHLY', '2024-05')).toBe(true);
    expect(shouldGenerateRecurringTransaction('2024-01', '2024-06', 'MONTHLY', '2024-07')).toBe(false);
  });

  it('should not generate before start month', () => {
    expect(shouldGenerateRecurringTransaction('2024-06', null, 'MONTHLY', '2024-05')).toBe(false);
  });
});

describe('getCurrentMonth', () => {
  it('should return current month in YYYY-MM format', () => {
    const month = getCurrentMonth();
    expect(month).toMatch(/^\d{4}-\d{2}$/);
  });
});

