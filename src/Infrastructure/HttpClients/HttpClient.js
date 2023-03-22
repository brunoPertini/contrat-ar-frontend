import axios from 'axios';
import Logger from '../Logging/Logger';

export class HttpClient {
  #baseUrl;

  #instance;

  constructor({ baseUrl }) {
    this.#baseUrl = baseUrl;
    this.#instance = axios.create({ baseURL: baseUrl });
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

  get(params) {
    return this.instance.get('', { params })
      .then((response) => response.data)
      .catch((error) => Logger.log(error));
  }
}
