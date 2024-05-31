/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import Logger from '../Logging/Logger';

/**
 * @typedef HttpClientInstanceConfiguration
 * Config needed to set the instance (headers, cookies, etc)
 * @property {{token: String}} headersValues
 */

/**
 * @typedef RequestCustomConfig
 * Axios per request config, not shared by the instance
 * @property {{ headers: Object<String, String>}} headers
 */

const defaultHeadersValues = {
  Authorization: undefined,
};

export class HttpClient {
  #baseUrl;

  #instance;

  /** @type {RequestCustomConfig} */
  #requestConfig;

  constructor({ baseUrl, headersValues = defaultHeadersValues, useClientCredentials = true }) {
    this.#baseUrl = baseUrl || process.env.REACT_APP_BACKEND_URL;
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const AuthorizationHeaderValue = headersValues.Authorization
      ? `Bearer ${headersValues.Authorization}` : undefined;

    let headers = {
      TimeZone: timeZone,
    };

    if (AuthorizationHeaderValue) {
      headers = {
        ...headers,
        Authorization: AuthorizationHeaderValue,
      };
    }

    if (useClientCredentials) {
      headers = {
        ...headers,
        'client-id': process.env.REACT_APP_CLIENT_ID,
        'client-secret': process.env.REACT_APP_CLIENT_SECRET,
      };
    }

    this.#instance = axios.create({
      baseURL: this.#baseUrl,
      headers,
    });

    this.#requestConfig = null;
  }

  setHeaders({ name, value }) {
    if (this.#requestConfig === null) {
      this.#requestConfig = {
        headers: {
          [name]: value,
        },
      };
    } else {
      this.#requestConfig.headers = {
        ...this.#requestConfig.headers,
        [name]: value,
      };
    }
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

  set requestConfig(config) {
    this.requestConfig = config;
  }

  get requestConfig() {
    return this.#requestConfig;
  }

  #handleError(error) {
    if (error?.response) {
      const { status } = error.response;
      if (status && status === 401) {
        Logger.log(error.response);
        return Promise.reject({ data: error.response.data, status });
      }
      const wrappedError = error.response.data.error;
      Logger.log(wrappedError);
      return Promise.reject(wrappedError);
    }
    return Promise.reject(error);
  }

  /**
   * @param {string} url
   * @param {Object} params The query params
   * @param {{withCredentials: Boolean }} config additional config for the request
   * @returns {Promise<Object|Error>}
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
   * @param {Object} config object containing meaningful data for request (headers for instance)
   */
  post(url, params, body, config = {}) {
    return this.instance.post(url, body, { params, headers: config.headers })
      .then((response) => response.data)
      .catch((error) => this.#handleError(error));
  }

  /**
   * @param {string} url
   * @param {Object} params The query params
   * @param {Object} body Request payload
   * @param {Object} config object containing meaningful data for request (headers for instance)
   */
  put(url, params, body, config = {}) {
    return this.instance.put(url, body, { params, headers: config.headers })
      .then((response) => response.data)
      .catch((error) => this.#handleError(error));
  }

  /**
   * @param {string} url
   * @param {Object} params The query params
   * @param {Object} config object containing meaningful data for request (headers for instance)
   */
  delete(url, params, config = {}) {
    return this.instance.delete(url, { params, headers: config.headers })
      .then((response) => response.data)
      .catch((error) => this.#handleError(error));
  }
}
