import { ExternalHttpClient } from './HttpClients/ExternalHttpClient';

export class HttpClientFactory {
  static externalInstance;

  static createExternalHttpClient(baseUrl) {
    if (!HttpClientFactory.externalInstance) {
      return new ExternalHttpClient({ baseUrl });
    }
    return HttpClientFactory.externalInstance;
  }
}
