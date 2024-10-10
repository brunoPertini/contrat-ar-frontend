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
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';

const buttonEnablingDuration = 2 * 60 * 1000;

const localStorageService = new LocalStorageService();

function getRemainingTime() {
  const storedTime = localStorage.getItem(LocalStorageService.PAGES_KEYS.SHARED.BUTTON_ENABLE_TIME);
  if (!storedTime) {
    return 0;
  }
  const currentTime = new Date().getTime();
  return storedTime - currentTime;
}

function AccountMailConfirmation({ email, sendAccountConfirmEmail, containerProps }) {
  // null = not send, false = send with errors, true = send and ok
  const [wasEmailSend, setWasEmailSend] = useState(null);

  const [alertData, setAlertData] = useState({ label: '', severity: '' });

  const [isLoading, setIsLoading] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(!isLoading);

  const buttonClicked = wasEmailSend !== null;

  function updateTimer() {
    const remainingTime = getRemainingTime();

    if (remainingTime <= 0) {
      setButtonEnabled(true);
      localStorage.removeItem('buttonUnlockTime');
    } else {
      setTimeout(updateTimer, 1000);
    }
  }

  function startTimer() {
    setButtonEnabled(false);

    const unlockTime = new Date().getTime() + buttonEnablingDuration;
    localStorageService.setItem(
      LocalStorageService.PAGES_KEYS.SHARED.BUTTON_ENABLE_TIME,
      unlockTime,
    );

    updateTimer();
  }

  const handleSendEmail = useCallback(() => {
    startTimer();
    setIsLoading(true);
    sendAccountConfirmEmail(email).then(() => {
      setWasEmailSend(true);
      setAlertData({ severity: 'success', label: signUpLabels['signup.mail.send'].replace('{email}', email) });
    })
      .catch((error) => {
        setWasEmailSend(false);
        setAlertData({ label: error.error, severity: 'error' });
      })
      .finally(() => setIsLoading(false));
  }, [email, sendAccountConfirmEmail]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" {...containerProps}>
      <Typography variant="h5">
        { !wasEmailSend ? signUpLabels['signup.accountConfirmation.title'] : sharedLabels.youCanLeavePage}
      </Typography>
      <Box display="flex" sx={{ mt: '2%' }} flexDirection="row">
        <PriorityHighIcon style={{ fontSize: '2rem' }} />
        <Typography variant="h5">
          { signUpLabels['account.confirmation.disclaimer']}
        </Typography>
      </Box>

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
      {
        wasEmailSend && !buttonEnabled && (
          <Typography variant="h6" sx={{ color: 'red' }}>
            { signUpLabels['email.send.wait.minutes'] }
          </Typography>
        )
      }
    </Box>
  );
}

export default AccountMailConfirmation;
