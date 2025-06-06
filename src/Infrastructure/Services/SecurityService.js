/* eslint-disable no-unused-vars */
import isEmpty from 'lodash/isEmpty';
import { HttpClient } from '../HttpClients/HttpClient';
import { UserHttpClient } from '../HttpClients/UserHttpClient';
import { HttpClientFactory } from '../HttpClientFactory';
import Logger from '../Logging/Logger';
import { signinLabels } from '../../StaticData/SignIn';
import { errorMessages } from '../../StaticData/Shared';
import { removeOnLeavingTabHandlers } from '../../Shared/Hooks/useOnLeavingTabHandler';
import { LocalStorageService } from './LocalStorageService';
import { routes } from '../../Shared/Constants';

const jose = require('jose');

const localStorageService = new LocalStorageService();

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

  #handleLogout;

  static SECURED_PATHS = ['/cliente', '/producto', '/servicio', '/proveedor', '/profile', '/admin', '/contact'];

  static LOGIN_PATH = '/signin';

  constructor({ handleLogout }) {
    this.#handleLogout = handleLogout;
  }

  #handleError(error) {
    if (window.location.pathname === routes.contact) {
      return Promise.resolve();
    }

    const knownErrors = {
      JWTExpired: errorMessages.sessionExpired,
      JWSSignatureVerificationFailed: signinLabels['error.jwt.verificationFailed'],
      JOSENotSupported: signinLabels['error.unknown'],
      TypeError: signinLabels['error.unknown'],
    };

    Logger.log(error);
    const errorClassName = error?.constructor?.name;
    if (errorClassName) {
      if (errorClassName === 'JWTExpired' || errorClassName === 'JWSInvalid') {
        HttpClientFactory.cleanInstances();
        removeOnLeavingTabHandlers();
        Object.keys(LocalStorageService.PAGES_KEYS).forEach(
          (page) => localStorageService.removeAllKeysOfPage(page),
        );

        if (this.#handleLogout) {
          return this.#handleLogout();
        }

        window.location.href = routes.signin;
      }

      throw new Error(knownErrors[error.constructor.name]);
    }

    throw new Error(signinLabels['error.unknown']);
  }

  async readJwtPayload(jwt) {
    if (!this.#publicKey) {
      await this.#loadPublicKey();
    }
    return jose.jwtVerify(jwt, this.#publicKey)
      .then((jwtResultValue) => jwtResultValue.payload)
      .catch((error) => this.#handleError(error));
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
   * @param {String | Number} alternativeId if the token belongs to an admin,
   * an alternativeId from another user should be send
  */
  async validateJwt(jwt, alternativeId) {
    return this.readJwtPayload(jwt).then((payload) => {
      if (!isEmpty(payload)) {
        const isProveedor = payload.role.startsWith('PROVEEDOR_');
        this.#httpClient = HttpClientFactory.createUserHttpClient('', { token: jwt, handleLogout: this.#handleLogout });
        return this.#httpClient.getUserInfo(alternativeId
          || payload.id, isProveedor ? { formatType: 'DAY_AND_MONTH' }
          : {}).then((response) => ({
          ...payload,
          ...response,
          password: '$%$$%()', // To never expose user's password, I harcode this fake value to be shown in an input
        })).catch((response) => Promise.reject(response));
      }

      return {};
    }).catch((error) => Promise.reject(error.message));
  }
}

export default SecurityService;
