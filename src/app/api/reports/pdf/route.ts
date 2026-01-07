import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTransactions } from '@/lib/actions/transactions';
import { calculateBudgetSummary } from '@/lib/calculations';
import { formatEuros } from '@/lib/money';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    // Récupérer les transactions
    const transactions = await getTransactions(month);
    const summary = calculateBudgetSummary(transactions);

    // Générer le HTML du rapport
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport Budget - ${month}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      color: #1a1a1a;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
    }
    h1 {
      color: #3b82f6;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .date {
      color: #666;
      font-size: 18px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid;
    }
    .card.income { border-left-color: #10b981; }
    .card.expense { border-left-color: #ef4444; }
    .card.investment { border-left-color: #3b82f6; }
    .card.savings { border-left-color: #F2C086; }
    .card-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    .card-value {
      font-size: 28px;
      font-weight: bold;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 24px;
      margin-bottom: 20px;
      color: #1a1a1a;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #1a1a1a;
    }
    .amount {
      font-weight: 600;
    }
    .income-amount { color: #10b981; }
    .expense-amount { color: #ef4444; }
    .investment-amount { color: #3b82f6; }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .summary { page-break-inside: avoid; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Rapport Budgétaire</h1>
    <div class="date">${new Date(month).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</div>
  </div>

  <div class="summary">
    <div class="card income">
      <div class="card-label">Revenus</div>
      <div class="card-value">${formatEuros(summary.totalIncome)}</div>
    </div>
    <div class="card expense">
      <div class="card-label">Dépenses</div>
      <div class="card-value">${formatEuros(summary.totalExpense)}</div>
    </div>
    <div class="card investment">
      <div class="card-label">Investissements</div>
      <div class="card-value">${formatEuros(summary.totalInvestment)}</div>
    </div>
  </div>

  <div class="summary">
    <div class="card savings">
      <div class="card-label">Reste à vivre</div>
      <div class="card-value">${formatEuros(summary.savings)}</div>
    </div>
    <div class="card investment">
      <div class="card-label">Taux d'investissement</div>
      <div class="card-value">${summary.savingsRate.toFixed(1)}%</div>
    </div>
    <div class="card savings">
      <div class="card-label">Taux d'épargne global</div>
      <div class="card-value">${summary.globalSavingsRate.toFixed(1)}%</div>
    </div>
  </div>

  ${transactions.filter(t => t.type === 'INCOME').length > 0 ? `
  <div class="section">
    <h2 class="section-title">Revenus</h2>
    <table>
      <thead>
        <tr>
          <th>Libellé</th>
          <th>Catégorie</th>
          <th>Propriétaire</th>
          <th style="text-align: right;">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${transactions
          .filter(t => t.type === 'INCOME')
          .map(t => `
            <tr>
              <td>${t.label}</td>
              <td>${t.category?.name || '-'}</td>
              <td>${t.owner === 'ME' ? 'Moi' : t.owner === 'PARTNER' ? 'Partenaire' : 'Commun'}</td>
              <td style="text-align: right;" class="amount income-amount">${formatEuros(t.amount)}</td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${transactions.filter(t => t.type === 'EXPENSE').length > 0 ? `
  <div class="section">
    <h2 class="section-title">Dépenses</h2>
    <table>
      <thead>
        <tr>
          <th>Libellé</th>
          <th>Catégorie</th>
          <th>Propriétaire</th>
          <th style="text-align: right;">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${transactions
          .filter(t => t.type === 'EXPENSE')
          .map(t => `
            <tr>
              <td>${t.label}</td>
              <td>${t.category?.name || '-'}</td>
              <td>${t.owner === 'ME' ? 'Moi' : t.owner === 'PARTNER' ? 'Partenaire' : 'Commun'}</td>
              <td style="text-align: right;" class="amount expense-amount">${formatEuros(t.amount)}</td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${transactions.filter(t => t.type === 'INVESTMENT').length > 0 ? `
  <div class="section">
    <h2 class="section-title">Investissements</h2>
    <table>
      <thead>
        <tr>
          <th>Libellé</th>
          <th>Enveloppe</th>
          <th>Propriétaire</th>
          <th style="text-align: right;">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${transactions
          .filter(t => t.type === 'INVESTMENT')
          .map(t => `
            <tr>
              <td>${t.label}</td>
              <td>${t.investmentEnvelope?.name || '-'}</td>
              <td>${t.owner === 'ME' ? 'Moi' : t.owner === 'PARTNER' ? 'Partenaire' : 'Commun'}</td>
              <td style="text-align: right;" class="amount investment-amount">${formatEuros(t.amount)}</td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} par Kasa</p>
    <p>Ce document est confidentiel et ne doit pas être partagé sans autorisation.</p>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="rapport-budget-${month}.html"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du rapport' },
      { status: 500 }
    );
  }
}

