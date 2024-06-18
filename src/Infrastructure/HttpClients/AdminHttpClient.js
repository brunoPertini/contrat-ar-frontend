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
   * @param {{ usuarioType: String }} usuarioType
   * @param {{name: String, surname: String, email: String,
   *  onlyActives: Boolean, plan: Number}} filters
   */
  getUsuariosByFilters(usuarioType, filters = {}) {
    const queryParams = { type: usuarioType };

    if ('onlyActives' in filters) {
      queryParams.showOnlyActives = filters.onlyActives;
      delete filters.onlyActives;
    }

    if ('plan' in filters) {
      if (filters.plan) {
        queryParams.planId = filters.plan;
      }
      delete filters.plan;
    }

    return this.post(adminRoutes.getUsuariosInfo, queryParams, filters);
  }
}
