/* eslint-disable no-unused-vars */
import isEmpty from 'lodash/isEmpty';
import { HttpClient } from '../HttpClients/HttpClient';
import { UserHttpClient } from '../HttpClients/UserHttpClient';
import { HttpClientFactory } from '../HttpClientFactory';
import Logger from '../Logging/Logger';

const jose = require('jose');

class SecurityService {
  /**
   * @property {String} publicKey
   */
  #publicKey = '';

  /**
   *
   * @property {HttpClient | UserHttpClient} httpClient
   */
  #httpClient;

  #handleError(error) {
    const errorMessages = {
      JWSSignatureVerificationFailed: 'Hubo un error al iniciar sesión, por favor intentalo más tarde',
      JOSENotSupported: 'Estamos en mantenimiento, por favor iniciá sesión más tarde',
      TypeError: 'Estamos en mantenimiento, por favor iniciá sesión más tarde',
    };

    Logger.log(error);
    throw new Error(errorMessages[error.constructor.name]);
  }

  async loadPublicKey() {
    try {
      this.#httpClient = HttpClientFactory.createUserHttpClient();
      const spkiContent = await this.#httpClient.getPublicKey();
      this.#publicKey = await jose.importSPKI(spkiContent, 'RS256');
      return this.#publicKey;
    } catch (error) {
      return this.#handleError(error);
    }
  }

  /**
   * @returns {{exp: Date,
   *  nbf: Date,
   *  role: String,
   *  sub: String}} If the jwt is valid, returns its decoded payload,
   * empty object otherwise
   * @param {string} jwt
  */
  async validateJwt(jwt) {
    return jose.jwtVerify(jwt, this.#publicKey).then((jwtResultValue) => {
      const { payload } = jwtResultValue;
      return !isEmpty(payload) ? payload : {};
    }).catch((error) => this.#handleError(error));
  }
}

export default SecurityService;
