/* eslint-disable no-new-wrappers */
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

const argentinaCurrencySymbol = getLocaleCurrencySymbol(ARGENTINA_LOCALE);

const replaceArgentinianCurrencySymbol = (toCheckValue) => toCheckValue.replace(argentinaCurrencySymbol, '');

/**
   * Handles input parsing from RangeSlider component
   * @param {Array<String | Number>} newValue
   * @param {Boolean} comesFromInput if the change was done through  bottom inputs
   * @param {Boolean} iconPressed dispatches the search function when changing values from input
   * @param{Function} setFiltersApplied function changing RangeSlider's wrapper component state
   * @param {Function} onFiltersApplied function that dispatches container component logic
   */
export const handleSliderPricesChanged = (
  newValue,
  comesFromInput,
  iconPressed = false,
  setFiltersApplied,
  onFiltersApplied,
) => {
  const shouldParseValuesForSlider = [false, false];

  shouldParseValuesForSlider[0] = typeof newValue[0] === 'string' && newValue[0].indexOf(argentinaCurrencySymbol) !== -1;
  shouldParseValuesForSlider[1] = typeof newValue[1] === 'string' && newValue[1].indexOf(argentinaCurrencySymbol) !== -1;

  // Handling the case where it may be changed from input
  if (shouldParseValuesForSlider[0]) {
    newValue[0] = new Number(replaceArgentinianCurrencySymbol(newValue[0]));
  }

  if (shouldParseValuesForSlider[1]) {
    newValue[1] = new Number(replaceArgentinianCurrencySymbol(newValue[1]));
  }

  let newAppliedFilters = {};
  setFiltersApplied((previous) => {
    newAppliedFilters = ({ ...previous, prices: newValue });
    return newAppliedFilters;
  });

  if (!comesFromInput || (comesFromInput && iconPressed)) {
    onFiltersApplied(newAppliedFilters);
  }
  return newValue;
};
