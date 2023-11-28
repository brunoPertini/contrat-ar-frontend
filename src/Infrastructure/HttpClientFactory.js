import { ExternalHttpClient } from './HttpClients/ExternalHttpClient';
// eslint-disable-next-line import/named
import { HttpClient, HttpClientInstanceConfiguration } from './HttpClients/HttpClient';
import { ProveedorHttpClient } from './HttpClients/ProveedorHttpClient';
import { UserHttpClient } from './HttpClients/UserHttpClient';
import { VendibleHttpClient } from './HttpClients/VendibleHttpClient';

/**
 * @typedef HttpClientInstanceFactoryConfiguration
 * Params needed to be passed to instances for several purposes
 * @property {String} token
 */

export class HttpClientFactory {
  static httpClientInstance;

  static externalInstance;

  static userHttpClientInstance;

  static vendibleHttpClientInstance;

  static proveedorHttpClientInstance;

  /**
   *
   * @param {string} baseUrl
   * @returns {HttpClient}
   */
  static createHttpClient(baseUrl) {
    if (!HttpClientFactory.httpClientInstance) {
      HttpClientFactory.httpClientInstance = new HttpClient({ baseUrl });
    }
    return HttpClientFactory.httpClientInstance;
  }

  /**
   *
   * @param {string} baseUrl
   * @param {HttpClientInstanceFactoryConfiguration} config
   * @returns {UserHttpClient}
   */
  static createUserHttpClient(baseUrl, config = {}) {
    HttpClientFactory.userHttpClientInstance = new UserHttpClient({
      baseUrl,
      headersValues: { Authorization: config.token },
    });
    return HttpClientFactory.userHttpClientInstance;
  }

  /**
   *
   * @param {string} baseUrl
   * @param {HttpClientInstanceFactoryConfiguration} config
   * @returns {HttpClientFactory}
   */
  static createExternalHttpClient(baseUrl, config) {
    if (!HttpClientFactory.externalInstance) {
      HttpClientFactory.externalInstance = new ExternalHttpClient({
        baseUrl,
        headersValues: { Authorization: config.token },
      });
    }
    return HttpClientFactory.externalInstance;
  }

  /**
   *
   * @param {string} vendibleType
   * @param {HttpClientInstanceFactoryConfiguration} config
   * @returns {VendibleHttpClient}
   */
  static createVendibleHttpClient(vendibleType, config) {
    if (!HttpClientFactory.vendibleHttpClientInstance
      || HttpClientFactory.vendibleHttpClientInstance.vendibleType !== vendibleType) {
      HttpClientFactory.vendibleHttpClientInstance = new VendibleHttpClient(
        vendibleType,
        { headersValues: { Authorization: config.token } },
      );
    }
    return HttpClientFactory.vendibleHttpClientInstance;
  }

  /**
   *
   * @param {HttpClientInstanceFactoryConfiguration} config
   * @returns {ProveedorHttpClient}
   */
  static createProveedorHttpClient(config) {
    if (!HttpClientFactory.proveedorHttpClientInstance) {
      HttpClientFactory.proveedorHttpClientInstance = new ProveedorHttpClient({
        headersValues: { Authorization: config.token },
      });
    }
    return HttpClientFactory.proveedorHttpClientInstance;
  }
}
