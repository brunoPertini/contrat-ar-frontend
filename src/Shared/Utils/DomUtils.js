/**
 * Creates and appends elementType in elementLocation, assigning attributes to elementType
 * @param {string} elementType
 * @param {string} elementLocation body or head
 * @param {object} attributes
 */
export function createDomElement(elementType, elementLocation, attributes) {
  if (!('id' in attributes) || !attributes.id) {
    throw new Error('Created element must have an id');
  }
  if (!document.querySelector(attributes.id)) {
    const element = document.createElement(elementType);
    Object.assign(element, attributes);
    document[elementLocation].appendChild(element);
  }
}
