/* eslint-disable no-new-wrappers */
import { systemConstants } from '../../Shared/Constants';
import { usersRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export class UserHttpClient extends HttpClient {
  constructor() {
    super({
      headers: {
        'client-id': 'contractarFrontend',
        'client-secret': 'contractar',
      },
    });
  }

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

  login(queryParams) {
    return this.get(usersRoutes.login, queryParams, { withCredentials: true });
  }
}
