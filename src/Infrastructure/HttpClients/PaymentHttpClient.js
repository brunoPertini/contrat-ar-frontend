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
   * @param {Number} toBeBindUserId
   * @param {String} returnTab MY_PAYMENTS or PLAN
   * @returns {Promise<String>} Checkout url
   */
  paySubscriptionFromUserProfile(subscriptionId, toBeBindUserId, returnTab = 'MY_PAYMENTS') {
    const url = paymentRoutes.paySubscriptionFromUserProfile.replace('{subscriptionId}', subscriptionId);
    return this.post(url, { returnTab }, { integrationType: 'OUTSITE', toBeBindUserId });
  }

  getPaymentInfo(paymentId) {
    const url = proveedoresRoutes.paymentById.replace('{paymentId}', paymentId);

    return this.get(url);
  }

  getPaymentsOfUser(userId) {
    const url = paymentRoutes.getUserPayments.replace('{userId}', userId);

    return this.get(url).then((payments) => payments)
      .catch(() => ({ payments: [], states: [] }));
  }
}
