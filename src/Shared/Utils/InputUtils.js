const ONLY_NUMBERS_REGEX = /[^a-z]/gi;

export const DOT_AND_COMMA_REGEX = /[,.]/gi;

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
