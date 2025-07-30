import pickBy from 'lodash/pickBy';
import { proveedoresRoutes, usersRoutes } from '../../Shared/Constants/ApiRoutes';
import { PROVEEDOR, ROLE_PROVEEDOR_PRODUCTOS } from '../../Shared/Constants/System';
import { HEADERS_NAMES, HEADERS_VALUES } from '../Constants';
import { HttpClientFactory } from '../HttpClientFactory';
import { HttpClient } from './HttpClient';

export class ProveedorHttpClient extends HttpClient {
  constructor(config) {
    super({ headersValues: config.headersValues, handleLogout: config.handleLogout });
  }

  /**
   *
   * @param {File} file
   * @param {String} dni
   * @returns {Promise<String>} The uploaded file url
   */
  uploadTemporalProfilePhoto(dni, file) {
    this.setHeaders({
      name: HEADERS_NAMES.CONTENT_TYPE,
      value: HEADERS_VALUES.CONTENT_TYPE.MULTIPART_FORM_DATA,
    });

    const formData = new FormData();
    formData.append('file', file);

    const url = proveedoresRoutes.uploadTemporalProfilePhoto.replace('{dni}', dni);

    return this.post(url, null, formData, this.requestConfig);
  }

  /**
   *
   * @param {File} file
   * @param {String} proveedorId
   * @returns {Promise<String>} The uploaded file url
   */
  uploadProfilePhoto(proveedorId, file) {
    this.setHeaders({
      name: HEADERS_NAMES.CONTENT_TYPE,
      value: HEADERS_VALUES.CONTENT_TYPE.MULTIPART_FORM_DATA,
    });

    const formData = new FormData();
    formData.append('file', file);

    const url = proveedoresRoutes.changeProfilePhoto.replace('{proveedorId}', proveedorId);

    return this.post(url, null, formData, this.requestConfig);
  }

  /**
   *
   * @param {Number} proveedorId
   * @param {{
   * state: String,
   * vendibleNombre: String,
   * categoryName: String,
   * }} filters
   */
  getVendibles(proveedorId, filters) {
    const url = proveedoresRoutes.getVendibles.replace('{proveedorId}', proveedorId);
    const sanitizedFilters = pickBy(filters, (value) => !!value);
    return this.post(url, null, sanitizedFilters);
  }

  postVendible({ role, proveedorId, body }) {
    const url = role === ROLE_PROVEEDOR_PRODUCTOS ? proveedoresRoutes.productoBaseUrl
      : proveedoresRoutes.servicioBaseUrl;
    return this.post(url, { proveedorId }, body);
  }

  putVendible({ vendibleId, proveedorId, body }) {
    const url = proveedoresRoutes.vendibleOperations
      .replace('{vendibleId}', vendibleId)
      .replace('{proveedorId}', proveedorId);

    return this.put(url, null, body);
  }

  deleteVendible({ vendibleId, proveedorId }) {
    const url = proveedoresRoutes.vendibleOperations
      .replace('{vendibleId}', vendibleId)
      .replace('{proveedorId}', proveedorId);

    return this.delete(url);
  }

  /**
   *
   * @param {String | Number} userId
   * @param {{ phone: String, location: { coordinates: Array<Number>}, fotoPerfilUrl: String}} info
   * @param {{ token: String}} config
   * @returns {Promise<void> | Promise<Error>}
   */
  updateCommonInfo(userId, info, config) {
    const userHttpClient = HttpClientFactory.createUserHttpClient(null, config);

    return userHttpClient.updateUserCommonInfo(userId, info, PROVEEDOR);
  }

  /**
   *
   * @param {String | Number} proveedorId
   * @param {Number} planId new planId
   * * @returns {Promise<void> | Promise<Error>}
   */
  updatePlan(proveedorId, planId) {
    const url = proveedoresRoutes.changePlan
      .replace('{proveedorId}', proveedorId)
      .replace('{planId}', planId);

    return this.post(url);
  }

  getAllPlanes() {
    return this.get(proveedoresRoutes.planBaseUrl, {});
  }

  /**
   *
   * @param {String | Number} proveedorId
   * @param {Number} planId new planId
   * @param {Number} [promotionId]
   * * @returns {Promise<void> | Promise<Error>}
   */
  createSubscription(proveedorId, planId, promotionId) {
    const url = proveedoresRoutes.proveedorSubscription
      .replace('{proveedorId}', proveedorId)
      .replace('{planId}', planId);

    const queryParams = promotionId ? { promotionId } : {};

    return this.post(url, queryParams);
  }

  cancelPlanChange(changeRequestId) {
    const url = proveedoresRoutes.cancelPlanChange.replace('{changeRequestId}', changeRequestId);

    return this.delete(url);
  }

  getUserPromotions(userId) {
    const url = usersRoutes.promotionsByUser.replace('{promotionId}', userId);

    return this.get(url);
  }
}
