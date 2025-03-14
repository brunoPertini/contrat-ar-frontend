import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import SecurityData from '../../UserProfile/SecurityData';
import StaticAlert from '../../Shared/Components/StaticAlert';
import { signinLabels } from '../../StaticData/SignIn';
import Footer from '../../Shared/Components/Footer';
import { buildFooterOptions } from '../../Shared/Helpers/UtilsHelper';
import { routes } from '../../Shared/Constants';
import SecurityService from '../../Infrastructure/Services/SecurityService';
import { userProfileLabels } from '../../StaticData/UserProfile';
import { flexColumn } from '../../Shared/Constants/Styles';

const footerOptions = buildFooterOptions();

const securityService = new SecurityService({});

export default function RestorePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [isTokenValid, setIsTokenValid] = useState();

  const [wasUpdateSuccessful, setWasUpdateSuccessful] = useState(null);

  const [data, setData] = useState({ password: '', confirmPassword: '' });

  const [decodedToken, setDecodedToken] = useState();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');

  const userHttpClient = useMemo(
    () => HttpClientFactory.createUserHttpClient(null, { token }),
    [token],
  );

  const handleDataChanged = (key, value) => setData(
    (previous) => ({
      ...previous,
      [key]: value,
    }),
  );

  const handleCheckToken = () => {
    setIsLoading(true);
    userHttpClient.checkForgotPasswordToken().then((result) => {
      setIsTokenValid(result);
    })
      .catch(() => {
        setIsTokenValid(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleConfirmEdition = () => {
    setIsLoading(true);

    return userHttpClient.updateUserCommonInfo(decodedToken.id, { ...data }, decodedToken.role).then(() => {
      setWasUpdateSuccessful(true);
    })
      .catch(() => {
        setWasUpdateSuccessful(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const decodeToken = useCallback(async () => {
    const decodedInfo = await securityService.readJwtPayload(token);
    setDecodedToken(decodedInfo);
  }, [setDecodedToken]);

  useEffect(() => {
    handleCheckToken();
  }, []);

  useEffect(() => {
    if (isTokenValid) {
      decodeToken();
    }
  }, [isTokenValid]);

  const canRenderPasswordForm = isTokenValid && wasUpdateSuccessful === null && !isLoading;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
    >
      <Header />
      { isLoading && (
      <Box {...flexColumn} alignItems="center">
        <CircularProgress sx={{ mt: '2%' }} />
        <Typography variant="h6">
          {sharedLabels.loading}
        </Typography>
      </Box>
      ) }
      {
        canRenderPasswordForm && (
        <SecurityData
          data={data}
          setData={handleDataChanged}
          handleConfirmEdition={handleConfirmEdition}
          styles={{ height: '100vh', minHeight: '100vh' }}
          isInForgotPasswordPage
          isEditModeEnabled
          is2FaValid
        />
        )
      }
      {
        wasUpdateSuccessful && (
        <StaticAlert
          severity="success"
          label={userProfileLabels['password.change.success']}
          styles={{
            mt: '15px',
          }}
        />
        )
      }
      {
        wasUpdateSuccessful === false && (
        <StaticAlert
          severity="error"
          label={userProfileLabels['password.change.error']}
          styles={{
            mt: '15px',
          }}
        />
        )
      }
      {
        isTokenValid === false && (
        <StaticAlert
          severity="error"
          label={signinLabels['forgotPassword.tokenCheck.error'].replace('{signinLink}', routes.signin)}
          styles={{
            mt: '15px',
          }}
        />
        )
      }
      <Footer options={footerOptions} />
    </Box>
  );
}
