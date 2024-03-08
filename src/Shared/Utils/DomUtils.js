/* eslint-disable valid-typeof */
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

/**
 *
 * @param {string} selector
 * @returns If element having passed selector is being shown
 */
export function isElementBeingShown(selector) {
  const element = document.querySelector(selector);
  return element || ((typeof element === 'Element')
    && window.getComputedStyle(element).display === 'none');
}

/**
 *
 * @param {Event} event
 * @returns if event is of type click
 */
export function isClickEvent(event) {
  return event.type === 'click';
}

/**
 *
 * @param {Event} event
 * @returns if enter key was pressed
 */
export function isEnterPressed(event) {
  return event.key === 'Enter';
}

export function isDeletePressed(event) {
  return event.key === 'Backspace';
}

/**
 *
 * @param {Event} event
 * @returns if event is of type key
 */
export function isKeyEvent(event) {
  return !!event && event.type.includes('key');
}
