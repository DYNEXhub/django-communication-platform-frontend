/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale code (default: pt-PT)
 */
export function formatCurrency(
  value: number,
  currency: string = 'EUR',
  locale: string = 'pt-PT'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a date
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale code (default: pt-BR)
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @param locale - Locale code (default: pt-BR)
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      return rtf.format(-count, interval.label as Intl.RelativeTimeFormatUnit);
    }
  }

  return 'agora';
}

/**
 * Format a phone number
 * @param phone - Phone number string
 * @param countryCode - Country code (default: +351 for Portugal)
 */
export function formatPhone(phone: string, countryCode: string = '+351'): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If number starts with country code, remove it for formatting
  let numberToFormat = cleaned;
  const countryDigits = countryCode.replace(/\D/g, '');

  if (cleaned.startsWith(countryDigits)) {
    numberToFormat = cleaned.slice(countryDigits.length);
  }

  // Format based on length (Portuguese format: +351 912 345 678)
  if (numberToFormat.length === 9) {
    return `${countryCode} ${numberToFormat.slice(0, 3)} ${numberToFormat.slice(3, 6)} ${numberToFormat.slice(6)}`;
  }

  // Return with country code if not formatted
  return `${countryCode} ${numberToFormat}`;
}

/**
 * Format a date as short date (e.g., "21/03/2026")
 * @param date - Date string or Date object
 * @param locale - Locale code (default: pt-BR)
 */
export function formatShortDate(
  date: string | Date,
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date and time
 * @param date - Date string or Date object
 * @param locale - Locale code (default: pt-BR)
 */
export function formatDateTime(
  date: string | Date,
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}
