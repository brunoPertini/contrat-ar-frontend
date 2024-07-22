/* eslint-disable import/named */
import { systemConstants } from '../../Shared/Constants';
import { vendiblesRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient, HttpClientInstanceConfiguration } from './HttpClient';

export class VendibleHttpClient extends HttpClient {
/**
 *
 * @param {String} vendibleType PRODUCTO or SERVICIO
 * @param{HttpClientInstanceConfiguration} config
 */
  constructor(vendibleType, config) {
    if (!vendibleType) {
      throw new Error('vendibleType is mandatory');
    }
    super({ headersValues: config.headersValues });

    this.vendibleType = vendibleType;
  }

  getVendibleByFilters(filters = {}) {
    const finalUrl = this.vendibleType === systemConstants.PRODUCTS
      ? vendiblesRoutes.getProduct : vendiblesRoutes.getService;

    const acceptedFilters = ['category', 'nombre'];

    const queryParams = {};

    Object.keys(filters)
      .filter((f) => acceptedFilters.includes(f))
      .forEach((key) => {
        if (filters[key]) {
          queryParams[key] = filters[key];
        }
      });

    return this.get(finalUrl, queryParams);
  }

  /**
   *
   * @param {File} file
   * @param {String} proveedorId
   * @returns {Promise<String>} The uploaded file url
   */
  uploadImage(file, proveedorId) {
    const formData = new FormData();
    formData.append('file', file);

    const url = vendiblesRoutes.uploadImage.replace('{proveedorId}', proveedorId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this.post(url, null, formData, config);
  }
}
