const ONLY_NUMBERS_REGEX = /^[0-9.]+$/;

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
 * @param {Event} event
 * @returns {String} The given string in event's value with only numbers and '.' char
 */
export function deleteNonNumericCharacters(event) {
  const { value } = event.target;
  const lastChar = value.at(value.length - 1);

  if (!lastChar) {
    return value;
  }

  if (stringHasOnlyNumbers(value)) {
    return value.replace(DOT_AND_COMMA_REGEX, '');
  }

  return value.slice(0, value.length - 1)
    .replace(DOT_AND_COMMA_REGEX, '');
}
