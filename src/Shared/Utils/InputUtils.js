import isEmail from 'validator/lib/isEmail';

const ONLY_NUMBERS_REGEX = /^[0-9.]+$/g;

export const DOT_AND_COMMA_REGEX = /[.,]/gi;

/**
 * @param {string} string
 * @returns {boolean} if string only contains numbers
 */
export function stringHasOnlyNumbers(string) {
  return string.match(ONLY_NUMBERS_REGEX);
}

/**
 * Deletes numbers in value
 * @param {string} value
 */
export function cleanNumbersFromInput(value) {
  return value.replace(ONLY_NUMBERS_REGEX, '');
}

/**
 * @param {String} value
 * @returns {String} The given string with only numbers and '.' char
 */
export function deleteNonNumericCharacters(value) {
  if (!value) {
    return value;
  }

  return value.replace(/[^0-9]/g, '');
}

export function escapeRegExpChars(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 *
 * @param {String} value
 * @returns
 */
export function stringIsEmail(value) {
  return isEmail(value);
}
