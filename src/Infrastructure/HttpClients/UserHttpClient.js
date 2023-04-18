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

    return this.post(url, queryParams, body);
  }
}
