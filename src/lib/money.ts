/**
 * Conversion des montants entre centimes (DB) et unités monétaires (affichage)
 * IMPORTANT: Certaines devises n'ont pas de subdivision (XAF, XOF, GNF)
 */

import { convertCurrency } from './currency-converter';

// Devises sans subdivision (pas de centimes)
const CURRENCIES_WITHOUT_SUBUNITS = ['XAF', 'XOF', 'GNF'];

export function centsToUnits(cents: number, currency: string = 'EUR'): number {
  // Pour les devises sans subdivision, retourner directement la valeur
  if (CURRENCIES_WITHOUT_SUBUNITS.includes(currency)) {
    return cents;
  }
  // Pour les autres devises, diviser par 100
  return cents / 100;
}

export function unitsToCents(units: number, currency: string = 'EUR'): number {
  // Pour les devises sans subdivision, retourner directement la valeur
  if (CURRENCIES_WITHOUT_SUBUNITS.includes(currency)) {
    return Math.round(units);
  }
  // Pour les autres devises, multiplier par 100
  return Math.round(units * 100);
}

// Mapping des devises pour l'affichage
const CURRENCY_CONFIG: Record<string, { locale: string; decimals: number }> = {
  EUR: { locale: 'fr-FR', decimals: 2 },
  USD: { locale: 'en-US', decimals: 2 },
  GBP: { locale: 'en-GB', decimals: 2 },
  CHF: { locale: 'fr-CH', decimals: 2 },
  CAD: { locale: 'en-CA', decimals: 2 },
  XAF: { locale: 'fr-CM', decimals: 0 }, // Franc CFA CEMAC - pas de décimales
  XOF: { locale: 'fr-SN', decimals: 0 }, // Franc CFA UEMOA - pas de décimales
  CDF: { locale: 'fr-CD', decimals: 2 }, // Franc congolais
  GNF: { locale: 'fr-GN', decimals: 0 }, // Franc guinéen - pas de décimales
  MAD: { locale: 'ar-MA', decimals: 2 }, // Dirham marocain
  TND: { locale: 'ar-TN', decimals: 3 }, // Dinar tunisien - 3 décimales
};

export function formatMoney(cents: number, currency: string = 'EUR'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG['EUR'];
  const units = centsToUnits(cents, currency);
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(units).replace(/\s/g, '\u00A0'); // Espace insécable
}

// Alias pour compatibilité
export function formatEuros(cents: number, currency: string = 'EUR'): string {
  return formatMoney(cents, currency);
}

// Format compact pour les grands montants
export function formatMoneyCompact(cents: number, currency: string = 'EUR'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG['EUR'];
  const units = centsToUnits(cents, currency);
  
  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(units);
  
  // Symbole de la devise
  const symbol = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
  }).formatToParts(0).find(part => part.type === 'currency')?.value || currency;
  
  return `${formatted}\u00A0${symbol}`;
}

export function formatEurosCompact(cents: number, currency: string = 'EUR'): string {
  return formatMoneyCompact(cents, currency);
}

// Format avec option de masquage
export function formatMoneyWithVisibility(cents: number, isHidden: boolean, currency: string = 'EUR'): string {
  if (isHidden) return '•••••';
  return formatMoneyCompact(cents, currency);
}

export function formatEurosWithVisibility(cents: number, isHidden: boolean, currency: string = 'EUR'): string {
  return formatMoneyWithVisibility(cents, isHidden, currency);
}

export function formatMoneyShort(cents: number, currency: string = 'EUR'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG['EUR'];
  const units = centsToUnits(cents, currency);
  
  // Symbole de la devise
  const symbol = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
  }).formatToParts(0).find(part => part.type === 'currency')?.value || currency;
  
  if (units >= 1000000) {
    return `${(units / 1000000).toFixed(1)}M\u00A0${symbol}`;
  }
  if (units >= 1000) {
    return `${(units / 1000).toFixed(1)}k\u00A0${symbol}`;
  }
  return formatMoney(cents, currency);
}

export function formatEurosShort(cents: number, currency: string = 'EUR'): string {
  return formatMoneyShort(cents, currency);
}

/**
 * Formater un montant avec conversion de devise
 * @param cents - Montant en "centimes" (ou unités pour devises sans subdivision)
 * @param sourceCurrency - Devise d'origine du montant
 * @param targetCurrency - Devise dans laquelle afficher le montant
 * @returns Montant formaté et converti
 */
export function formatMoneyWithConversion(
  cents: number,
  sourceCurrency: string,
  targetCurrency: string
): string {
  // Normaliser les devises (uppercase, et gérer null/undefined)
  const normalizedSource = (sourceCurrency || targetCurrency || 'EUR').toUpperCase();
  const normalizedTarget = (targetCurrency || sourceCurrency || 'EUR').toUpperCase();
  
  // Convertir en unités dans la devise source
  const sourceUnits = centsToUnits(cents, normalizedSource);
  
  // Si même devise, pas de conversion
  if (normalizedSource === normalizedTarget) {
    return formatMoney(cents, normalizedTarget);
  }
  
  // Convertir dans la devise cible
  const targetUnits = convertCurrency(sourceUnits, normalizedSource, normalizedTarget);
  
  // Reconvertir en "centimes" pour la devise cible
  const targetCents = unitsToCents(targetUnits, normalizedTarget);
  
  // Formater dans la devise cible
  return formatMoney(targetCents, normalizedTarget);
}

/**
 * Formater un montant compact avec conversion de devise
 */
export function formatMoneyCompactWithConversion(
  cents: number,
  sourceCurrency: string,
  targetCurrency: string
): string {
  // Normaliser les devises (uppercase, et gérer null/undefined)
  const normalizedSource = (sourceCurrency || targetCurrency || 'EUR').toUpperCase();
  const normalizedTarget = (targetCurrency || sourceCurrency || 'EUR').toUpperCase();
  
  const sourceUnits = centsToUnits(cents, normalizedSource);
  
  if (normalizedSource === normalizedTarget) {
    return formatMoneyCompact(cents, normalizedTarget);
  }
  
  const targetUnits = convertCurrency(sourceUnits, normalizedSource, normalizedTarget);
  const targetCents = unitsToCents(targetUnits, normalizedTarget);
  
  return formatMoneyCompact(targetCents, normalizedTarget);
}

/**
 * Formater avec visibilité et conversion
 */
export function formatMoneyWithVisibilityAndConversion(
  cents: number,
  isHidden: boolean,
  sourceCurrency: string,
  targetCurrency: string
): string {
  if (isHidden) return '•••••';
  return formatMoneyCompactWithConversion(cents, sourceCurrency, targetCurrency);
}

