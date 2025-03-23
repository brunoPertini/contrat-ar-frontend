import { proveedoresRoutes } from '../../Shared/Constants';
import { paymentRoutes } from '../../Shared/Constants/ApiRoutes';
import { HttpClient } from './HttpClient';

export class PaymentHttpClient extends HttpClient {
  paySubscription(subscriptionId) {
    const url = proveedoresRoutes.paySubscription.replace('{subscriptionId}', subscriptionId);
    return this.post(url, null, { integrationType: 'OUTSITE' });
  }

  /**
   *
   * @param {Number} subscriptionId
   * @param {String} returnTab MY_PAYMENTS or PLAN
   * @returns {Promise<String>} Checkout url
   */
  paySubscriptionFromUserProfile(subscriptionId, returnTab = 'MY_PAYMENTS') {
    const url = paymentRoutes.paySubscriptionFromUserProfile.replace('{subscriptionId}', subscriptionId);
    return this.post(url, { returnTab }, { integrationType: 'OUTSITE' });
  }

  getPaymentInfo(paymentId) {
    const url = proveedoresRoutes.paymentById.replace('{paymentId}', paymentId);

    return this.get(url);
  }

  getPaymentsOfSubscription(subscriptionId) {
    const url = paymentRoutes.getSubscriptionPayments.replace('{subscriptionId}', subscriptionId);

    return this.get(url).then((payments) => payments)
      .catch(() => []);
  }
}
