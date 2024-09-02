import { sharedLabels } from '../../StaticData/Shared';
import { ARGENTINA_LOCALE } from '../Constants/System';
import { formatNumberWithLocale, getLocaleCurrencySymbol } from './PricesHelper';

export function getTextForDistanceSliderInput(text) {
  return `${text} Km`;
}

export function getTextForPricesSliderInput(text) {
  return `${getLocaleCurrencySymbol(ARGENTINA_LOCALE)}${formatNumberWithLocale(text)}`;
}

export const locationSliderInputHelperTexts = [sharedLabels.minimum, sharedLabels.maximum];

export const pricesSliderInputHelperTexts = [sharedLabels.minimum, sharedLabels.maximum];
