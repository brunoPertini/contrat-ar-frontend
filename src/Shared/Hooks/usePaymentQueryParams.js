import { useEffect, useState } from 'react';

export default function usePaymentQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);

  const [params, setParams] = useState({ paymentId: null, status: '' });

  useEffect(() => {
    const paymentId = queryParams.get('paymentId');
    const status = queryParams.get('status');

    if (paymentId && status) {
      setParams((previous) => ({ ...previous, paymentId, status }));
    }
  }, []);

  return params;
}
