import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Layout from './Layout';
import { sharedLabels } from '../../StaticData/Shared';

export default function TwoFactorAuthentication({ sendCodeEmail, sendConfirmEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  return (
    <Layout isLoading={isLoading}>
      <Typography variant="h5">
        { sharedLabels['2fa.start.title']}
      </Typography>
      <Button
        disabled={!buttonEnabled}
        onClick={() => handleSendEmail(email)}
        variant="contained"
        size="small"
        sx={{
          width: '40%',
          mt: '5%',
        }}
      >
        { sharedLabels.sendEmail }
      </Button>
    </Layout>
  );
}
