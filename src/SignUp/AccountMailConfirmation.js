import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { signUpLabels } from '../StaticData/SignUp';
import { sharedLabels } from '../StaticData/Shared';
import StaticAlert from '../Shared/Components/StaticAlert';
import useDisableElementTimer from '../Shared/Hooks/useDisableElementTimer';

function AccountMailConfirmation({ email, sendAccountConfirmEmail, containerProps }) {
  // null = not send, false = send with errors, true = send and ok
  const [wasEmailSend, setWasEmailSend] = useState(null);

  const [alertData, setAlertData] = useState({ label: '', severity: '' });

  const [isLoading, setIsLoading] = useState(false);

  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(!isLoading);

  const buttonClicked = wasEmailSend !== null;

  const handleSendEmail = useCallback(() => {
    setIsTimerStarted(true);
    setIsLoading(true);
    sendAccountConfirmEmail(email).then(() => {
      setWasEmailSend(true);
      setAlertData({ severity: 'success', label: signUpLabels['signup.mail.send'].replace('{email}', email) });
    })
      .catch((error) => {
        setWasEmailSend(false);
        setAlertData({
          label: error.status !== 500
            ? error.error : sharedLabels.unknownError,
          severity: 'error',
        });
      })
      .finally(() => setIsLoading(false));
  }, [email, sendAccountConfirmEmail]);

  const buttonDisableDisclaimer = useDisableElementTimer({
    disableDuration: 2,
    enableFn: () => {
      setButtonEnabled(true);
      setIsTimerStarted(false);
    },
    disableFn: () => setButtonEnabled(false),
    isTimerStarted,
    label: sharedLabels['email.send.wait.minutes'],
  });

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
      { buttonDisableDisclaimer }
    </Box>
  );
}
AccountMailConfirmation.defaultProps = {
  containerProps: {},
};

AccountMailConfirmation.propTypes = {
  email: PropTypes.string.isRequired,
  sendAccountConfirmEmail: PropTypes.func.isRequired,
  containerProps: PropTypes.object,
};

export default AccountMailConfirmation;
