import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import SecurityData from '../../UserProfile/SecurityData';
import { StaticAlert } from '../../Shared/Components';
import { signinLabels } from '../../StaticData/SignIn';
import Footer from '../../Shared/Components/Footer';
import { buildFooterOptions } from '../../Shared/Helpers/UtilsHelper';
import { routes } from '../../Shared/Constants';

const footerOptions = buildFooterOptions();

export default function RestorePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isTokenValid, setIsTokenValid] = useState();

  const [data, setData] = useState({ password: '', confirmPassword: '' });

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

  useEffect(() => {
    handleCheckToken();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
    >
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
        isTokenValid && (
        <SecurityData
          data={data}
          setData={handleDataChanged}
          styles={{ height: '100vh', minHeight: '100vh' }}
          isInForgotPasswordPage
          isEditModeEnabled
          is2FaValid
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
