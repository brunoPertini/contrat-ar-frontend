import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Layout from './Layout';
import { sharedLabels } from '../../StaticData/Shared';
import useDisableElementTimer from '../Hooks/useDisableElementTimer';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { flexColumn } from '../Constants/Styles';
import StaticAlert from './StaticAlert';
import { EMPTY_FUNCTION, TwoFactorAuthResult } from '../Constants/System';

export default function TwoFactorAuthentication({ userToken, onVerificationSuccess, handleLogout = EMPTY_FUNCTION }) {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);

  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const [twoFaData, setTwoFaData] = useState({ codeTtl: null, codeDigits: null });

  const [codeInputs, setCodeInputs] = useState([]);

  const [wasCodeVerified, setWasCodeVerified] = useState(false);

  const [alertData, setAlertData] = useState({ label: '', severity: '' });

  const [verificationResult, setVerificationResult] = useState(null);

  const userHttpClient = useMemo(
    () => HttpClientFactory.createUserHttpClient(null, { token: userToken, handleLogout }),
    [userToken],
  );

  const buttonDisableDisclaimer = useDisableElementTimer({
    disableDuration: twoFaData.codeTtl,
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
    setIsTimerStarted(true);
    userHttpClient.send2FaCode().then(({ codeTtl, codeDigits }) => {
      setTwoFaData({ codeDigits, codeTtl });
      setCodeInputs(new Array(codeDigits).fill(''));
    })
      .catch((error) => {
        if (error.status === 409) {
          setAlertData({ severity: 'error', label: error });
          setButtonEnabled(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setVerificationResult(null);
        setWasCodeVerified(false);
      });
  }, [userHttpClient]);

  const handleSendConfirmationEmail = useCallback(() => {
    setCodeInputs((currentCodeInputs) => {
      userHttpClient.confirn2FaCode(currentCodeInputs.join('')).then((result) => {
        const isCheckOk = result === TwoFactorAuthResult.PASSED;
        setVerificationResult(isCheckOk);

        if (isCheckOk) {
          onVerificationSuccess();
        }

        if (result === TwoFactorAuthResult.FAILED) {
          setAlertData({ severity: 'error', label: sharedLabels['2fa.wrongCode'] });
        } else if (result === TwoFactorAuthResult.EXPIRED) {
          setAlertData({ severity: 'error', label: sharedLabels['2fa.codeExpired'] });
        }
      })
        .catch((error) => {
          if (error.status === 409) {
            setAlertData({ severity: 'error', label: error });
          }
        })
        .finally(() => setIsLoading(false));

      return currentCodeInputs;
    });
  }, [userHttpClient]);

  const showCodeInput = useMemo(() => (twoFaData.codeDigits && twoFaData.codeTtl)
  && !(verificationResult === false), [twoFaData, verificationResult]);

  useEffect(() => {
    const filledInputsLength = codeInputs.reduce((
      previous,
      current,
    ) => (current ? (previous + 1) : (previous + 0)), 0);

    setWasCodeVerified((wasCodeChecked) => {
      if (filledInputsLength === twoFaData.codeDigits && !wasCodeChecked) {
        setIsLoading(true);
        setWasCodeVerified(true);
        handleSendConfirmationEmail();
      }

      return wasCodeChecked;
    });
  }, [codeInputs, wasCodeVerified]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const newInputs = [...codeInputs];
    newInputs[index] = value;
    setCodeInputs(newInputs);

    if (value && index < codeInputs.length - 1) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }
  };

  return (
    <Layout
      gridProps={{
        sx: {
          ...flexColumn,
          alignItems: 'center',
        },
      }}
      isLoading={isLoading}
    >
      <Typography variant="h5">
        { sharedLabels['2fa.start.title']}
      </Typography>
      {showCodeInput && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '1%' }}>
          {codeInputs.map((digit, index) => (
            <TextField
              key={index}
              id={`code-input-${index}`}
              type="text"
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              sx={{ width: '40px' }}
              disabled={verificationResult === false}
            />
          ))}
        </div>
      )}
      {
          verificationResult === false && <StaticAlert styles={{ mt: '1%' }} {...alertData} />
      }
      <Button
        disabled={!buttonEnabled}
        onClick={() => handleSendCodeEmail()}
        variant="contained"
        size="small"
        sx={{
          width: '40%',
          mt: '3%',
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
  onVerificationSuccess: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
