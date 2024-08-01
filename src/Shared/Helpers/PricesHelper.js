/* eslint-disable no-new-wrappers */
import { sharedLabels } from '../../StaticData/Shared';
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

const deleteUnitsLabel = (label) => label.replace(sharedLabels.units, '');

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
  const shouldParseValuesForSlider = [false, false];

  const labelFormatters = {
    precios: replaceArgentinianCurrencySymbol,
    stocks: deleteUnitsLabel,
  };

  const labelCheckers = {
    precios: () => {
      shouldParseValuesForSlider[0] = typeof newValue[0] === 'string' && newValue[0].indexOf(argentinaCurrencySymbol) !== -1;
      shouldParseValuesForSlider[1] = typeof newValue[1] === 'string' && newValue[1].indexOf(argentinaCurrencySymbol) !== -1;
    },
    stocks: () => {
      shouldParseValuesForSlider[0] = typeof newValue[0] === 'string' && newValue[0].indexOf(sharedLabels.units) !== -1;
      shouldParseValuesForSlider[1] = typeof newValue[1] === 'string' && newValue[1].indexOf(sharedLabels.units) !== -1;
    },
  };

  labelCheckers[key]();

  // Handling the case where it may be changed from input
  if (shouldParseValuesForSlider[0]) {
    newValue[0] = new Number(labelFormatters[key](newValue[0]));
  }

  if (shouldParseValuesForSlider[1]) {
    newValue[1] = new Number(labelFormatters[key](newValue[1]));
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
