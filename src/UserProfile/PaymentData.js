import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { sharedLabels } from '../StaticData/Shared';
import { userProfileLabels } from '../StaticData/UserProfile';
import Disclaimer from '../Shared/Components/Disclaimer';
import { flexColumn } from '../Shared/Constants/Styles';
import { paymentLabels } from '../StaticData/Payment';
import Layout from '../Shared/Components/Layout';
import StaticAlert from '../Shared/Components/StaticAlert';
import { PAYMENT_STATE } from '../Shared/Constants/System';

const paymentsFields = ['paymentPeriod', 'date', 'amount', 'currency', 'state', 'paymentProviderName'];

const attributesRenderers = {
  state: (value) => {
    const label = paymentLabels['payment.state.translation'][value];
    let labelColor = 'inherit';

    if (value === PAYMENT_STATE.SUCCESS) {
      labelColor = 'green';
    }

    if (value === PAYMENT_STATE.ERROR) {
      labelColor = 'red';
    }

    return <span style={{ color: labelColor }}>{label}</span>;
  },
  paymentProviderName: (value) => value.toUpperCase(),
};

export default function PaymentData({
  getPayments, subscriptionId, isSubscriptionValid, canPaySubscription, paySubscription,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const handleSetPayments = useCallback(async () => {
    setIsLoading(true);
    const newPayments = await getPayments(subscriptionId);
    setPayments([...newPayments]);
    setIsLoading(false);
  }, [setPayments]);

  useEffect(() => {
    handleSetPayments();
  }, []);

  const hasNoPayments = useMemo(() => !isLoading && !payments.length, [isLoading, payments]);

  const handlePaySubscription = useCallback(() => {
    setIsLoading(true);
    paySubscription(subscriptionId, 'payment').then((checkoutUrl) => {
      window.location.href = checkoutUrl;
    });
  }, [paySubscription]);

  return (
    <Layout
      gridProps={{ sx: { ...flexColumn } }}
      isLoading={isLoading}
    >
      { canPaySubscription && isSubscriptionValid
      && (
        <Box>
          <Disclaimer text={userProfileLabels['plan.subscription.canBePayed']} />
          <Button
            variant="contained"
            sx={{ mt: '1%' }}
            onClick={handlePaySubscription}
          >
            { sharedLabels.pay}
          </Button>
        </Box>
      )}
      {
        hasNoPayments ? <StaticAlert severity="info" styles={{ mt: '1%' }} label={paymentLabels.noPaymentsDone} />
          : (
            <TableContainer component={Paper} sx={{ mt: '1%' }}>
              <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
                <TableHead>
                  <TableRow sx={{ borderBottom: '1px solid black' }}>
                    {
              Object.values(userProfileLabels.paymentData).map((label) => (
                <TableCell
                  sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                >
                  { label }
                </TableCell>
              ))
            }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow
                      key={`payment-row-${payment.id}`}
                    >
                      {
                    Object.keys(payment).map((attribute) => {
                      if (!paymentsFields.includes(attribute)) {
                        return null;
                      }

                      return (
                        <TableCell
                          key={`cell-${payment.id}-${attribute}`}
                          scope="row"
                          sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                        >
                          {
                           attribute in attributesRenderers
                             ? attributesRenderers[attribute](payment[attribute]) : payment[attribute]
                          }

                        </TableCell>
                      );
                    })
                  }
                    </TableRow>
                  ))}

                </TableBody>
              </Table>
            </TableContainer>
          )
      }

    </Layout>
  );
}

PaymentData.propTypes = {
  getPayments: PropTypes.func.isRequired,
  paySubscription: PropTypes.func.isRequired,
  subscriptionId: PropTypes.number.isRequired,
  canPaySubscription: PropTypes.bool.isRequired,
  isSubscriptionValid: PropTypes.bool.isRequired,
};
