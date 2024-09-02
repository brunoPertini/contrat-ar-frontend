/* eslint-disable no-new-wrappers */
import { ARGENTINA_LOCALE } from '../Constants/System';
import { deleteNonNumericCharacters } from '../Utils/InputUtils';

export const ARGENTINA_CURRENCY_CODE = 'ARS';

export const localesCurrencies = {
  [ARGENTINA_LOCALE]: ARGENTINA_CURRENCY_CODE,
};

/**
 *
 * @param {String} locale
 * @returns The given locale currency symbol
 */
export function getLocaleCurrencySymbol(locale = 'es-AR') {
  const formatObject = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: localesCurrencies[locale],
  });

  return formatObject.format().at(0);
}

const argentinaCurrencySymbol = getLocaleCurrencySymbol(ARGENTINA_LOCALE);

export const replaceArgentinianCurrencySymbol = (toCheckValue) => toCheckValue.replace(argentinaCurrencySymbol, '');

/**
   * Handles input parsing from RangeSlider component
   * @param {String} key filter key to update. Should be "precios" or "stocks"
   * @param {Array<String | Number>} newValue
   * @param {Boolean} comesFromInput if the change was done through  bottom inputs
   * @param {Boolean} iconPressed dispatches the search function when changing values from input
   * @param{Function} setFiltersApplied function changing RangeSlider's wrapper component state
   * @param {Function} onFiltersApplied function that dispatches container component logic
   */
export const handleSliderValuesChanged = (
  key,
  newValue,
  comesFromInput,
  iconPressed = false,
  setFiltersApplied,
  onFiltersApplied,
) => {
  const shouldParseValuesForSlider = [typeof newValue[0] === 'string', typeof newValue[1] === 'string'];

  // Handling the case where it may be changed from input
  if (shouldParseValuesForSlider[0]) {
    newValue[0] = new Number(newValue[0]);
  }

  if (shouldParseValuesForSlider[1]) {
    newValue[1] = new Number(newValue[1]);
  }

  let newAppliedFilters = {};
  setFiltersApplied((previous) => {
    newAppliedFilters = ({ ...previous, [key]: [...newValue] });
    return newAppliedFilters;
  });

  if (!comesFromInput || (comesFromInput && iconPressed)) {
    onFiltersApplied(newAppliedFilters);
  }
  return newValue;
};

/**
 *
 * @param {Number | String} number
 * @param {String} locale
 * @returns {String} number formatted with locale specs.
 */
export function formatNumberWithLocale(number, locale = 'es-AR') {
  const sanitizedNumber = typeof number === 'string' || number instanceof String ? deleteNonNumericCharacters(number) : number;
  // TODO: take locale using a backend service
  return new Intl.NumberFormat(locale).format(sanitizedNumber);
}
