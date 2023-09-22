/* eslint-disable no-new-wrappers */
import { systemConstants } from '../../Shared/Constants';
import { usersRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export class UserHttpClient extends HttpClient {
  crearUsuario(signupType, queryParams, body) {
    body.plan = body.selectedPlan;
    body.location = {
      x: new String(body.location.coords.latitude),
      y: new String(body.location.coords.longitude),
    };

    delete body.selectedPlan;

    const url = (signupType === systemConstants.USER_TYPE_CLIENTE)
      ? usersRoutes.createClient : usersRoutes.createProveedor;

    const finalQueryParams = {
      proveedorType: signupType === systemConstants.USER_TYPE_CLIENTE
        ? undefined : queryParams.proveedorType,
    };

    return this.post(url, finalQueryParams, body);
  }

  /**
    * @param{{email: string, password: string}} queryParams
    * @returns {Promise<String>} A JWT holding user info
   */
  login(queryParams) {
    return this.get(usersRoutes.login, queryParams);
  }

  /**
   * @returns {Promise<String>} the public key used to validate future incoming jwt
   */
  getPublicKey() {
    return this.get(usersRoutes.getPublicKey);
  }
}
