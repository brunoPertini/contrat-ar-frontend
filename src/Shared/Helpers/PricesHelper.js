import { ARGENTINA_LOCALE } from '../Constants/System';

export const ARGENTINA_CURRENCY_CODE = 'ARS';

export const localesCurrencies = {
  [ARGENTINA_LOCALE]: ARGENTINA_CURRENCY_CODE,
};

/**
 *
 * @param {String} locale
 * @returns The given locale currency symbol
 */
export function getLocaleCurrencySymbol(locale) {
  const formatObject = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: localesCurrencies[locale],
  });

  return formatObject.format().at(0);
}
