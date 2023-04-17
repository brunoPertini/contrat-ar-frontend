import axios from 'axios';
import Logger from '../Logging/Logger';

export class HttpClient {
  #baseUrl;

  #instance;

  constructor({ baseUrl }) {
    this.#baseUrl = baseUrl || 'http://localhost:8090';
    this.#instance = axios.create({ baseURL: this.#baseUrl });
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  set baseUrl(baseUrl) {
    this.#baseUrl = baseUrl;
  }

  get instance() {
    return this.#instance;
  }

  /**
   *
   * @param {Object} params The query params
   * @returns
   */
  get(params) {
    return this.instance.get('', { params })
      .then((response) => response.data)
      .catch((error) => Logger.log(error));
  }

  /**
   *
   * @param {Object} params The query params
   * @param {Object} body Request payload
   * @returns
   */
  post(url, params, body) {
    return this.instance.post(url, body, { params })
      .then((response) => response.data)
      .catch((error) => Logger.log(error));
  }
}
