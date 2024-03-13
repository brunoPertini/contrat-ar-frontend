import { thirdPartyRoutes } from '../../Shared/Constants';
import { HttpClient } from './HttpClient';

export class ExternalHttpClient extends HttpClient {
  constructor({ baseUrl, headersValues }) {
    super({ baseUrl, useClientCredentials: false, headersValues });
  }
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
    return this.get(
      thirdPartyRoutes.getAddressFromCoordinates,
      { ...params },
    ).then((data) => data.display_name)
      .catch((error) => error);
  }
}
