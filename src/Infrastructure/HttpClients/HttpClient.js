import axios from 'axios';
import Logger from '../Logging/Logger';

export class HttpClient {
  #baseUrl;

  #instance;

  constructor({ baseUrl, headers }) {
    this.#baseUrl = baseUrl || process.env.REACT_APP_BACKEND_URL;
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    this.#instance = axios.create({
      baseURL: this.#baseUrl,
      headers: { ...headers, TimeZone: timeZone },
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
   * @param {string} url
   * @param {Object} params The query params
   * @param {{withCredentials: Boolean }} config additional config for the request
   */
  get(url, params = {}, config) {
    const stringParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const fullUrl = stringParams ? `${url}?${stringParams}` : url;
    return this.instance.get(fullUrl, config)
      .then((response) => response.data)
      .catch((error) => this.#handleError(error));
  }

  /**
   * @param {string} url
   * @param {Object} params The query params
   * @param {Object} body Request payload
   */
  post(url, params, body) {
    return this.instance.post(url, body, { params })
      .then((response) => response.data)
      .catch((error) => this.#handleError(error));
  }
}
