import { ExternalHttpClient } from './HttpClients/ExternalHttpClient';
import { HttpClient } from './HttpClients/HttpClient';
import { UserHttpClient } from './HttpClients/UserHttpClient';

export class HttpClientFactory {
  static httpClientInstance;

  static externalInstance;

  static userHttpClientInstance;

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
   * @returns {UserHttpClient}
   */
  static createUserHttpClient(baseUrl) {
    if (!HttpClientFactory.userHttpClientInstance) {
      HttpClientFactory.userHttpClientInstance = new UserHttpClient({ baseUrl });
    }
    return HttpClientFactory.userHttpClientInstance;
  }

  /**
   *
   * @param {string} baseUrl
   * @returns {HttpClientFactory}
   */
  static createExternalHttpClient(baseUrl) {
    if (!HttpClientFactory.externalInstance) {
      HttpClientFactory.externalInstance = new ExternalHttpClient({ baseUrl });
    }
    return HttpClientFactory.externalInstance;
  }
}
