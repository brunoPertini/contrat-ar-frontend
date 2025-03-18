/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { flexColumn } from '../Shared/Constants/Styles';
import Disclaimer from '../Shared/Components/Disclaimer';
import { userProfileLabels } from '../StaticData/UserProfile';
import { sharedLabels } from '../StaticData/Shared';

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
      </Box>
      )}
    </Box>
  );
}
