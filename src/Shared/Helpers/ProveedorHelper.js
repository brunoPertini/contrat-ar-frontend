/**
 *
 * @param {{sourceVendibles: Array<T>, term: String}}
 */
export function filterVendiblesByTerm({ sourceVendibles, term }) {
  const regEx = new RegExp(term, 'i');
  return sourceVendibles.filter((v) => regEx.test(v.vendibleNombre));
}

/**
   *
   * @param {{vendibles: Array<T>, categoryName: String}}
   */
export function filterVendiblesByCategory({ vendibles, categoryName }) {
  return vendibles.filter((vendible) => vendible.categoryNames.includes(categoryName));
}
