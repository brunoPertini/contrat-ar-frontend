import { adminRoutes, vendiblesRoutes } from '../../Shared/Constants/ApiRoutes';
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
   *  showOnlyActives: Boolean, plan: Number}} filters
   */
  getUsuariosByFilters(usuarioType, filters = {}) {
    const queryParams = { type: usuarioType };

    const queryParamsFilters = ['showOnlyActives', 'plan'];

    queryParamsFilters
      .filter((f) => f in filters && filters[f] !== null)
      .forEach((filterKey) => {
        queryParams[filterKey] = filters[filterKey];
        delete filters[filterKey];
      });

    delete filters.showOnlyActives;

    return this.post(adminRoutes.getUsuariosInfo, queryParams, filters);
  }

  /**
   *
   * @param {Number | String} userId
   * @returns {import('../../State/Reducers/usuario').UsuarioModel} user info
   */
  getUserInfoForLogin(userId) {
    return this.get(adminRoutes.getUserInfo.replace('{userId}', userId));
  }

  /**
   *
   * @param {Number | String} userId
   * @param {*} body
   */
  updateProveedorPersonalData(userId, body) {
    return this.patch(adminRoutes.proveedoresById.replace('{userId}', userId), null, body);
  }

  /**
   *
   * @param {Number | String} userId
   * @param {*} body
   */
  updateClientePersonalData(userId, body) {
    return this.patch(adminRoutes.usuariosById.replace('{userId}', userId), null, body);
  }

  /**
   *
   * @param {Long | String} userId
   */
  deleteUser(userId) {
    return this.delete(adminRoutes.usuariosById.replace('{userId}', userId));
  }

  /**
   *
   * @param {Long | String} vendibleId
   */
  deleteVendible(vendibleId) {
    return this.delete(vendiblesRoutes.vendibleById.replace('{id}', vendibleId));
  }

  /**
   *
   * @param {Long | String} vendibleId
   * @param {Number} page
   * @param {Num} pageSize
   */
  getVendiblePosts(vendibleId, page, pageSize) {
    const url = adminRoutes.vendiblePosts.replace('{vendibleId}', vendibleId);

    const queryParams = { page, pageSize };

    return this.get(url, queryParams);
  }
}
