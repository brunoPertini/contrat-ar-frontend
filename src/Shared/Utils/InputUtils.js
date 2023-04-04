/**
 * Deletes numbers in value
 * @param {string} value
 */
export function cleanNumbersFromInput(value) {
  return value.replace(/[^a-z]/gi, '');
}
