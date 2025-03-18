import { proveedoresRoutes } from '../../Shared/Constants';
import { paymentRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export class PaymentHttpClient extends HttpClient {
  paySubscription(subscriptionId) {
    const url = proveedoresRoutes.paySubscription.replace('{subscriptionId}', subscriptionId);
    return this.post(url, null, { integrationType: 'OUTSITE' });
  }

  getPaymentInfo(paymentId) {
    const url = proveedoresRoutes.paymentById.replace('{paymentId}', paymentId);

    return this.get(url);
  }

  getPaymentsOfSubscription(subscriptionId) {
    const url = paymentRoutes.getSubscriptionPayments.replace('{subscriptionId}', subscriptionId);

    return this.get(url);
  }
}
