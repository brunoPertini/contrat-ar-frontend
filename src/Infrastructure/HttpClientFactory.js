import { HttpClient } from './HttpClients/HttpClient';

export class HttpClientFactory {
  static createHttpClient(baseUrl) {
    return new HttpClient({ baseUrl });
  }
}
