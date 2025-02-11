import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Layout from './Layout';
import { sharedLabels } from '../../StaticData/Shared';
import useDisableElementTimer from '../Hooks/useDisableElementTimer';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

export default function TwoFactorAuthentication({ userToken }) {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const userHttpClient = useMemo(
    () => HttpClientFactory.createUserHttpClient(null, { token: userToken }),
    [userToken],
  );

  const buttonDisableDisclaimer = useDisableElementTimer({
    disableDuration: 1,
    enableFn: () => {
      setButtonEnabled(true);
      setIsTimerStarted(false);
    },
    disableFn: () => setButtonEnabled(false),
    isTimerStarted,
    label: sharedLabels['email.send.wait.minutes'],
  });

  const handleSendCodeEmail = useCallback(() => {
    setIsLoading(true);
    userHttpClient.send2FaCode().then((response) => {
      console.log(response);
    });
  }, [userHttpClient]);

  return (
    <Layout isLoading={isLoading}>
      <Typography variant="h5">
        { sharedLabels['2fa.start.title']}
      </Typography>
      <Button
        disabled={!buttonEnabled}
        onClick={() => handleSendCodeEmail()}
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
    </Layout>
  );
}

TwoFactorAuthentication.propTypes = {
  userToken: PropTypes.string.isRequired,
};
