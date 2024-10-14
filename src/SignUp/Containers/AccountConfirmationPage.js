import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import StaticAlert from '../../Shared/Components/StaticAlert';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { signUpLabels } from '../../StaticData/SignUp';
import { routes } from '../../Shared/Constants';
import AccountMailConfirmation from '../AccountMailConfirmation';
import { stringIsEmail } from '../../Shared/Utils/InputUtils';

const userHttpClient = HttpClientFactory.createUserHttpClient();

function AccountConfirmationPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get('email');
  const token = queryParams.get('token');

  if (queryParams.size !== 2 || !stringIsEmail(email) || !token) {
    throw new Response('', { status: 404 });
  }

  const [operationResult, setOperationResult] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [errorCode, setErrorCode] = useState();

  const [mailWasResend, setMailWasResend] = useState(false);

  const sendAccountConfirmEmail = useCallback(() => userHttpClient.sendRegistrationConfirmEmail(
    email,
  )
    .then(() => {
      setErrorMessage('');
    })
    .finally(() => setMailWasResend(true)), [email]);

  const handleAccountConfirmation = useCallback(() => {
    userHttpClient.confirmUserAccount(email, token)
      .then(() => {
        setOperationResult(true);
      })
      .catch(((error) => {
        setOperationResult(false);
        setErrorMessage(error.error);
        if (error.relatedFields) {
          setErrorCode(error.relatedFields.verificationCode);
        }
      }));
  }, [setOperationResult, setErrorMessage]);

  useEffect(() => {
    handleAccountConfirmation();
  }, []);

  const linkLabel = `<a href="${process.env.REACT_APP_SITE_URL}${routes.signin}" style="color: white;">${sharedLabels.here}</a>`;

  const isLoading = operationResult === null;

  const confirmationHasError = operationResult === false && !mailWasResend;

  const isConfirmationOk = operationResult === true;

  const canResendEmail = operationResult === false && errorCode !== 401;

  const isUnknownError = operationResult === false && !errorCode;

  if (isUnknownError) {
    throw new Response('', { status: 404 });
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />
      { isLoading && (
        <>
          <CircularProgress sx={{ mt: '2%' }} />
          <Typography variant="h6">
            {sharedLabels.loading}
          </Typography>
        </>
      ) }
      {
       confirmationHasError && (
       <StaticAlert severity="error" label={errorMessage} styles={{ mt: '5%' }} />
       )
      }
      {
        isConfirmationOk && (
        <StaticAlert
          severity="success"
          styles={{ mt: '5%' }}
          label={signUpLabels['account.confirmation.success'].replace('{loginLink}', linkLabel)}
        />
        )
      }
      {
        canResendEmail && (
        <AccountMailConfirmation
          email={email}
          sendAccountConfirmEmail={sendAccountConfirmEmail}
          containerProps={{ sx: { mt: '5%' } }}
        />
        )
      }
    </Box>
  );
}

export default AccountConfirmationPage;
