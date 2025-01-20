import { proveedoresRoutes } from '../../Shared/Constants';
import { HttpClient } from './HttpClient';

export class PaymentHttpClient extends HttpClient {
  paySubscription(subscriptionId) {
    const url = proveedoresRoutes.paySubscription.replace('{subscriptionId}', subscriptionId);
    return this.post(url, null, { integrationType: 'OUTSITE' });
  }
}
