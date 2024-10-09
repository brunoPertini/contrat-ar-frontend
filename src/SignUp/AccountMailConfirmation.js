/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { signUpLabels } from '../StaticData/SignUp';
import { sharedLabels } from '../StaticData/Shared';
import StaticAlert from '../Shared/Components/StaticAlert';

function AccountMailConfirmation({ email, sendAccountConfirmEmail }) {
  // null = not send, false = send with errors, true = send and ok
  const [wasEmailSend, setWasEmailSend] = useState(null);

  const [alertData, setAlertData] = useState({ label: '', severity: '' });

  const [isLoading, setIsLoading] = useState(false);

  const buttonClicked = wasEmailSend !== null;

  const handleSendEmail = useCallback(() => {
    setIsLoading(true);
    sendAccountConfirmEmail(email).then(() => {
      setWasEmailSend(true);
      setAlertData({ severity: 'success', label: signUpLabels['signup.mail.send'].replace('{email}', email) });
    })
      .catch((error) => {
        setWasEmailSend(false);
        setAlertData({ label: error, severity: 'error' });
      })
      .finally(() => setIsLoading(false));
  }, [email, sendAccountConfirmEmail]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5">
        { !wasEmailSend ? signUpLabels['signup.accountConfirmation.title'] : sharedLabels.youCanLeavePage}
      </Typography>
      <Typography variant="h5" sx={{ mt: '2%' }}>
        <PriorityHighIcon fontSize="medium" />
        { signUpLabels['account.confirmation.disclaimer']}
      </Typography>
      { isLoading && (
        <>
          <CircularProgress sx={{ mt: '2%' }} />
          <Typography variant="h6">
            {sharedLabels.sendingEmail}
          </Typography>
        </>
      ) }
      {
        buttonClicked && <StaticAlert {...alertData} styles={{ mt: '5%' }} />
      }
      <Button
        disabled={buttonClicked || isLoading}
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
    </Box>
  );
}

export default AccountMailConfirmation;
