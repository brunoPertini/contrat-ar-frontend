import { proveedoresRoutes } from '../../Shared/Constants/ApiRoutes';
import { PROVEEDOR, ROLE_PROVEEDOR_PRODUCTOS } from '../../Shared/Constants/System';
import { HttpClientFactory } from '../HttpClientFactory';
import { HttpClient } from './HttpClient';

export class ProveedorHttpClient extends HttpClient {
  constructor(config) {
    super({ headersValues: config.headersValues });
  }

  /**
   *
   * @param {File} file
   * @param {String} proveedorId
   * @returns {Promise<String>} The uploaded file url
   */
  uploadProfilePhoto(proveedorId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const url = proveedoresRoutes.changeProfilePhoto.replace('{proveedorId}', proveedorId);

    return this.post(url, null, formData, config);
  }

  getVendibles(proveedorId) {
    const url = proveedoresRoutes.getVendibles.replace('{proveedorId}', proveedorId);
    return this.get(url);
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
}
