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
import HelpOutline from '@mui/icons-material/HelpOutline';
import Link from '@mui/material/Link';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../StaticData/Shared';
import { userProfileLabels } from '../StaticData/UserProfile';
import Disclaimer from '../Shared/Components/Disclaimer';
import { flexColumn, flexRow } from '../Shared/Constants/Styles';
import { paymentLabels } from '../StaticData/Payment';
import Layout from '../Shared/Components/Layout';
import StaticAlert from '../Shared/Components/StaticAlert';
import { PAYMENT_STATE } from '../Shared/Constants/System';
import { TABS_NAMES } from './Constants';
import DialogModal from '../Shared/Components/DialogModal';
import Tooltip from '../Shared/Components/Tooltip';

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

const labelsRenderers = {
  default: (paymentLabel) => (
    <TableCell
      sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
    >
      { paymentLabel }
    </TableCell>
  ),

  state: (paymentLabel, params) => (
    <TableCell
      sx={{
        borderBottom: '1px solid black',
        borderRight: '1px solid black',
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
      >
        { paymentLabel }
        <Tooltip
          placement="right-end"
          title={(
            <Box>
              {Object.keys(params).map((state) => (
                <Typography variant="h6" sx={{ mb: '1%' }}>
                  {state}
                  {' '}
                  :
                  {' '}
                  {params[state]}
                </Typography>
              ))}
            </Box>

          )}
        >
          <InfoIcon sx={{ cursor: 'pointer' }} />
        </Tooltip>
      </Box>

    </TableCell>
  ),
};

const disclaimerModalTexts = {
  title: paymentLabels['payment.disclaimer.title'],
  contextText: <span dangerouslySetInnerHTML={{
    __html: paymentLabels['payment.disclaimer.text'].replace(
      '{dataUsageLink}',
      process.env.REACT_APP_DATA_USAGE_URL,
    ),
  }}
  />,
};

export default function PaymentData({
  getPayments, subscriptionId, isSubscriptionValid, canPaySubscription, paySubscription,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const [states, setStates] = useState({});

  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const handleSetPayments = useCallback(async () => {
    setIsLoading(true);
    const { payments: newPayments, states: statesResponse } = await getPayments(subscriptionId);
    setPayments([...newPayments]);

    const newStatesObject = Object.keys(statesResponse).reduce((acc, key) => {
      const translation = paymentLabels['payment.state.translation'][key];
      acc[translation] = statesResponse[key];
      return acc;
    }, {});

    setStates({ ...newStatesObject });

    setIsLoading(false);
  }, [setPayments]);

  useEffect(() => {
    handleSetPayments();
  }, []);

  const hasNoPayments = useMemo(() => !isLoading && !payments.length, [isLoading, payments]);

  const handlePaySubscription = useCallback(() => {
    setIsLoading(true);
    paySubscription(subscriptionId, TABS_NAMES.MY_PAYMENTS).then((checkoutUrl) => {
      window.location.href = checkoutUrl;
    }).catch(() => setIsLoading(false));
  }, [paySubscription]);

  const openDisclaimer = useCallback(() => setIsDisclaimerOpen(true), [setIsDisclaimerOpen]);

  const closeDisclaimer = useCallback(() => setIsDisclaimerOpen(false), [setIsDisclaimerOpen]);

  const labelRenderersParams = {
    default: {},
    state: states,
  };

  return (
    <Layout
      gridProps={{ sx: { ...flexColumn } }}
      isLoading={isLoading}
    >
      <DialogModal
        {...disclaimerModalTexts}
        open={isDisclaimerOpen}
        onCloseDialog={closeDisclaimer}
        showButtons={false}
      />
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
        { canPaySubscription && isSubscriptionValid
      && (
      <Box {...flexColumn}>
        <Disclaimer text={userProfileLabels['plan.subscription.canBePayed']} />
        <Button
          variant="contained"
          sx={{ mt: '1%' }}
          onClick={handlePaySubscription}
        >
          {sharedLabels.pay}
        </Button>
      </Box>
      ) }

        <Box {...flexRow} alignItems="center" marginTop={{ xs: '3%', md: 0 }}>
          <HelpOutline />
          <Link variant="h6" sx={{ cursor: 'pointer' }} onClick={openDisclaimer}>
            { paymentLabels['payment.infoWeStore']}
          </Link>
        </Box>

      </Box>
      {
        hasNoPayments ? <StaticAlert severity="info" styles={{ mt: '1%' }} label={paymentLabels.noPaymentsDone} />
          : (
            <TableContainer component={Paper} sx={{ mt: '1%' }}>
              <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
                <TableHead>
                  <TableRow sx={{ borderBottom: '1px solid black' }}>
                    {
              Object.keys(userProfileLabels.paymentData).map((label) => {
                const key = label in labelsRenderers ? label : 'default';

                return labelsRenderers[key](userProfileLabels.paymentData[label], labelRenderersParams[key]);
              })
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
