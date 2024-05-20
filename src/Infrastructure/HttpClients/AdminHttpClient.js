import { adminRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export default class AdminHttpClient extends HttpClient {
  constructor(config) {
    super({ headersValues: config.headersValues });
  }

  /**
   *
   * @param {String | Number} sourceTableId
   * @param {String[]} attributes
   * @returns {Promise<any | Error>}
   */
  requestChangeExists(sourceTableId, attributes) {
    return this.get(
      adminRoutes.changeRequestExists,
      { sourceTableId, searchAttributes: attributes },
    );
  }
}
