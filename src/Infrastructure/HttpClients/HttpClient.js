import axios from 'axios';
import Logger from '../Logging/Logger';

export class HttpClient {
  #baseUrl;

  #instance;

  constructor({ baseUrl }) {
    this.#baseUrl = baseUrl || process.env.REACT_APP_BACKEND_URL;
    this.#instance = axios.create({
      baseURL: this.#baseUrl,
      headers: {
        'client-id': 'contractarFrontend',
        'client-secret': 'contractar',
      },
    });
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

  #handleError(error) {
    const wrappedError = error.response.data;
    Logger.log(wrappedError);
    return Promise.reject(wrappedError.error);
  }

  /**
   *
   * @param {Object} params The query params
   * @returns
   */
  get(url, params = {}) {
    const stringParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const fullUrl = stringParams ? `${url}?${stringParams}` : url;
    return this.instance.get(fullUrl)
      .then((response) => response.data)
      .catch((error) => this.#handleError(error));
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
      .catch((error) => this.#handleError(error));
  }
}
