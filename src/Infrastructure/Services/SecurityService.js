/* eslint-disable no-unused-vars */
import isEmpty from 'lodash/isEmpty';
import { HttpClient } from '../HttpClients/HttpClient';
import { UserHttpClient } from '../HttpClients/UserHttpClient';
import { HttpClientFactory } from '../HttpClientFactory';
import Logger from '../Logging/Logger';
import { signinLabels } from '../../StaticData/SignIn';

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

  static SECURED_PATHS = ['/cliente', '/producto', '/servicio', '/proveedor', '/profile'];

  static LOGIN_PATH = '/signin';

  #handleError(error) {
    const errorMessages = {
      JWSSignatureVerificationFailed: signinLabels['error.jwt.verificationFailed'],
      JOSENotSupported: signinLabels['error.unknown'],
      TypeError: signinLabels['error.unknown'],
    };

    Logger.log(error);
    throw new Error(errorMessages[error.constructor.name]);
  }

  /**
   * Loads the public key from backend so it is used to verify each user token
   *
   */
  async #loadPublicKey() {
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
   *  sub: String
   *  id: String
   *  role: String,
   *  name: String,
   *  surname: String,
   *  indexPage: String,
   *  authorities: Array<String>
   *  }} If the jwt is valid, returns its decoded payload, empty object otherwise
   * @param {string} jwt
  */
  async validateJwt(jwt) {
    if (!this.#publicKey) {
      await this.#loadPublicKey();
    }
    return jose.jwtVerify(jwt, this.#publicKey).then((jwtResultValue) => {
      const { payload } = jwtResultValue;
      if (!isEmpty(payload)) {
        this.#httpClient = HttpClientFactory.createUserHttpClient('', { token: jwt });
        return this.#httpClient.getUserInfo(payload.id).then((response) => ({
          ...payload,
          location: response.location,
          birthDate: response.birthDate,
          password: '$%$$%()', // To never expose user's password, I harcode this fake value to be shown in an input
        })).catch(() => payload);
      }

      return {};
    }).catch((error) => this.#handleError(error));
  }
}

export default SecurityService;
