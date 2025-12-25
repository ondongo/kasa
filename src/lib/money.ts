/**
 * Conversion des montants entre centimes (DB) et euros (affichage)
 */

export function centsToEuros(cents: number): number {
  return cents / 100;
}

export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

export function formatEuros(cents: number): string {
  const euros = centsToEuros(cents);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros).replace(/\s/g, '\u00A0'); // Espace insécable pour meilleur rendu
}

// Format compact pour les grands montants (ex: 1 234,56 €)
export function formatEurosCompact(cents: number): string {
  const euros = centsToEuros(cents);
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros);
  return `${formatted}\u00A0€`;
}

// Format avec option de masquage
export function formatEurosWithVisibility(cents: number, isHidden: boolean): string {
  if (isHidden) return '•••••';
  return formatEurosCompact(cents);
}

export function formatEurosShort(cents: number): string {
  const euros = centsToEuros(cents);
  if (euros >= 1000000) {
    return `${(euros / 1000000).toFixed(1)}M €`;
  }
  if (euros >= 1000) {
    return `${(euros / 1000).toFixed(1)}k €`;
  }
  return formatEuros(cents);
}

