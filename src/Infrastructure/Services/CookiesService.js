class CookiesService {
  static COOKIES_NAMES = {
    USER_TOKEN: 'userToken',
    USER_INDEX_PAGE: 'userIndexPage',
  };

  /**
 * @typedef CookieAttribute
 * @type {object}
 * @property {String} key
 * @property {String} value
 */

  /**
   * Adds the passed cookie with the given attributes
   * @param {String} key
   * @param {String} value
   * @param {Array<CookieAttribute>} attributes
   */
  add(key, value, attributes = []) {
    const appendIfExists = (cookieAttributeKey, cookieAttributeValue) => `${cookieAttributeKey}=${cookieAttributeValue}`;
    const initialCookieValue = `${key}=${value}`;
    const parsedAttributes = attributes.map(
      (attribute) => appendIfExists(attribute.key, attribute.value),
    );
    document.cookie = parsedAttributes.length ? `${initialCookieValue};${parsedAttributes.join(';')}` : initialCookieValue;
  }

  remove(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  get(key) {
    return document.cookie.split('; ')
      .find((row) => row.startsWith(key))
      ?.split('=')[1] || '';
  }
}

export default CookiesService;
