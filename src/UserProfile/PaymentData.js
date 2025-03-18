/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { sharedLabels } from '../StaticData/Shared';
import { userProfileLabels } from '../StaticData/UserProfile';
import Disclaimer from '../Shared/Components/Disclaimer';
import { flexColumn } from '../Shared/Constants/Styles';
import { paymentLabels } from '../StaticData/Payment';

const paymentsFields = ['paymentPeriod', 'date', 'amount', 'currency', 'state', 'paymentProviderName'];

const attributesRenderers = {
  state: (value) => paymentLabels['payment.state.translation'][value],
};

export default function PaymentData({ payments, canPaySubscription }) {
  return (
    <Box
      {...flexColumn}
    >
      { canPaySubscription
      && (
      <Box>
        <Disclaimer text={userProfileLabels['plan.subscription.canBePayed']} />
        <Button variant="contained" sx={{ mt: '1%' }}>
          { sharedLabels.pay}
        </Button>
        <TableContainer component={Paper}>
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
                  key={payment.id}
                >
                  {
                    Object.keys(payment).map((attribute) => {
                      if (!paymentsFields.contains(attribute)) {
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
      </Box>
      )}
    </Box>
  );
}
