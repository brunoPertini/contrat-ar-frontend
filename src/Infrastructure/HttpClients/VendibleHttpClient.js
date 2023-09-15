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

  getVendibleByName(nombre) {
    const finalUrl = this.vendibleType === systemConstants.PRODUCTS
      ? vendiblesRoutes.getProduct : vendiblesRoutes.getService;

    const queryParams = { nombre };

    return this.get(finalUrl, queryParams);
  }
}
