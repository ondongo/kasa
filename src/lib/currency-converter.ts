/**
 * Système de conversion de devises
 * Taux de change au 7 janvier 2025 (approximatifs)
 */

// Taux de change par rapport à l'Euro (EUR = 1)
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,           // Euro (base)
  USD: 1.09,        // Dollar américain
  XAF: 655.957,     // Franc CFA CEMAC
  XOF: 655.957,     // Franc CFA UEMOA (même taux que XAF)
  GBP: 0.83,        // Livre sterling
  CHF: 0.93,        // Franc suisse
  CAD: 1.51,        // Dollar canadien
  CDF: 2850,        // Franc congolais
  GNF: 9100,        // Franc guinéen
  MAD: 10.85,       // Dirham marocain
  TND: 3.38,        // Dinar tunisien
};

/**
 * Convertir un montant d'une devise à une autre
 * @param amount - Montant dans la devise source (en unités, pas en centimes)
 * @param fromCurrency - Devise source
 * @param toCurrency - Devise cible
 * @returns Montant converti dans la devise cible
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = EXCHANGE_RATES[fromCurrency] || EXCHANGE_RATES['EUR'];
  const toRate = EXCHANGE_RATES[toCurrency] || EXCHANGE_RATES['EUR'];

  // Convertir en EUR d'abord, puis dans la devise cible
  const amountInEUR = amount / fromRate;
  const convertedAmount = amountInEUR * toRate;

  return convertedAmount;
}

/**
 * Obtenir le taux de change entre deux devises
 * @param fromCurrency - Devise source
 * @param toCurrency - Devise cible
 * @returns Taux de change
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const fromRate = EXCHANGE_RATES[fromCurrency] || EXCHANGE_RATES['EUR'];
  const toRate = EXCHANGE_RATES[toCurrency] || EXCHANGE_RATES['EUR'];

  return toRate / fromRate;
}

/**
 * Mettre à jour les taux de change (pour une future API de taux en temps réel)
 * @param rates - Nouveaux taux de change
 */
export function updateExchangeRates(rates: Partial<Record<string, number>>) {
  Object.assign(EXCHANGE_RATES, rates);
}

/**
 * Obtenir tous les taux de change actuels
 * @returns Objet avec tous les taux
 */
export function getAllExchangeRates(): Record<string, number> {
  return { ...EXCHANGE_RATES };
}

