import { adminRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export default class AdminHttpClient extends HttpClient {
  constructor(config) {
    super({ ...config });
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

  getUsuariosInfo() {
    return this.get(adminRoutes.getUsuariosInfo);
  }

  /**
   * @param {{name: String, surname: String, type: String}} filters
   */
  getUsuariosByFilters(filters) {
    return this.get(adminRoutes.getUsuariosInfo, { ...filters });
  }
}
