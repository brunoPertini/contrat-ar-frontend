import { Box, CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { StaticAlert } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { signUpLabels } from '../../StaticData/SignUp';
import { routes } from '../../Shared/Constants';
import AccountMailConfirmation from '../AccountMailConfirmation';

const userHttpClient = HttpClientFactory.createUserHttpClient();

function AccountConfirmationPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get('email');

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
    userHttpClient.confirmUserAccount(email, queryParams.get('token'))
      .then(() => {
        setOperationResult(true);
      })
      .catch(((error) => {
        setOperationResult(false);
        setErrorMessage(error.error);
        setErrorCode(error.relatedFields.verificationCode);
      }));
  }, [setOperationResult, setErrorMessage]);

  useEffect(() => {
    handleAccountConfirmation();
  }, []);

  const linkLabel = `<a href="${process.env.REACT_APP_SITE_URL}${routes.signin}" style="color: white;">${sharedLabels.here}</a>`;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />
      { operationResult === null && (
        <>
          <CircularProgress sx={{ mt: '2%' }} />
          <Typography variant="h6">
            {sharedLabels.loading}
          </Typography>
        </>
      ) }
      {
        operationResult === false && !mailWasResend && (
        <StaticAlert severity="error" label={errorMessage} styles={{ mt: '5%' }} />
        )
      }
      {
        operationResult === true && (
        <StaticAlert
          severity="success"
          styles={{ mt: '5%' }}
          label={signUpLabels['account.confirmation.success'].replace('{loginLink}', linkLabel)}
        />
        )
      }
      {
         operationResult === false && errorCode !== 401 && (
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
