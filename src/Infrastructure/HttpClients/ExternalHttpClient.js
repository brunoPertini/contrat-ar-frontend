import { HttpClient } from './HttpClient';

export class ExternalHttpClient extends HttpClient {
/**
 * @typedef GetAddressFromLocationParams
 * @type {object}
 * @property {number} lat
 * @property {number} long
 */

  /**
   * Returns a readable address from a lat/long object
   * @param {GetAddressFromLocationParams} params
   * @returns {string}
   */
  getAddressFromLocation(params) {
    return this.get('', { ...params, format: 'json' }).then((data) => data.display_name);
  }
}
