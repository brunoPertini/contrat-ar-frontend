/* eslint-disable no-new-wrappers */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { HttpClient } from './HttpClient';

export class UserHttpClient extends HttpClient {
  crearCliente(url, queryParams, body) {
    body.plan = body.selectedPlan;
    body.location = {
      x: new String(body.location.coords.latitude),
      y: new String(body.location.coords.longitude),
    };

    delete body.selectedPlan;

    return this.post(url, queryParams, body);
  }
}
