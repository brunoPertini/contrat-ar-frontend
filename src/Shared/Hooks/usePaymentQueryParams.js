import { useEffect, useState } from 'react';
import { PAYMENT_STATE } from '../Constants/System';

export default function usePaymentQueryParams(paySubscriptionServiceResult) {
  const queryParams = new URLSearchParams(window.location.search);

  const [params, setParams] = useState({ paymentId: null, status: '' });

  useEffect(() => {
    const paymentId = queryParams.get('paymentId');
    const status = queryParams.get('status');

    if (paymentId && status) {
      setParams((previous) => ({ ...previous, paymentId, status }));
    }
  }, []);

  return paySubscriptionServiceResult === false
    ? { paymentId: null, status: PAYMENT_STATE.UNKNOWN } : params;
}
