export const ARGENTINA_CURRENCY_CODE = 'ARS';

/**
 *
 * @param {String} locale
 * @returns The given locale currency symbol
 */
export function getLocaleCurrencySymbol(locale) {
// TODO: deharcodear la currency de aca
  const formatObject = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: ARGENTINA_CURRENCY_CODE,
  });

  return formatObject.format().at(0);
}
