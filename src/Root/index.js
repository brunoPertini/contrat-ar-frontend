import { useEffect, useState } from 'react';
import {
  Box, Card, CardActionArea, CardContent, CardMedia, Stack, Typography,
} from '@mui/material';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import InformativeAlert from '../Shared/Components/Alert';
import { routes } from '../Shared/Constants';
import { rootPageLabels } from '../StaticData/RootPage';
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';
import { signUpLabels } from '../StaticData/SignUp';
import { indexLabels } from '../StaticData/Index';
import Footer from '../Shared/Components/Footer';

const localStorageService = new LocalStorageService();

const RootPage = withRouter(({ router }) => {
  const [alertData, setAlertData] = useState({
    isAlertOpen: false,
    alertLabel: '',
    alertSeverity: '',
  });

  const menuOptions = [{
    label: rootPageLabels.signup,
    onClick: () => {
      router.navigate(routes.signup);
    },
  },
  {
    label: rootPageLabels.signin,
    onClick: () => {
      router.navigate(routes.signin);
    },
  }];

  const handleAlertClose = () => {
    setAlertData({
      isAlertOpen: false,
      alertLabel: '',
      alertSeverity: '',
    });
  };

  useEffect(() => {
    const comesFromSignup = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.ROOT.COMES_FROM_SIGNUP,
    ) === 'true';

    const success = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.ROOT.SUCCESS,
    ) === 'true';

    localStorageService.removeAllKeysOfPage('ROOT');

    if (comesFromSignup && success) {
      return setAlertData({
        isAlertOpen: true,
        alertLabel: signUpLabels['signup.success'],
        alertSeverity: 'success',
      });
    }

    if (comesFromSignup && !success) {
      return setAlertData({
        isAlertOpen: true,
        alertLabel: signUpLabels['signup.error'],
        alertSeverity: 'error',
      });
    }

    return handleAlertClose();
  }, []);

  const renderBenefits = (benefits) => benefits.split('.')
    .filter((line) => !!(line))
    .map((line) => (
      <li>
        { line }
      </li>

    ));

  const indent = { marginLeft: '1%' };

  return (
    <Box display="flex" flexDirection="column">
      <InformativeAlert
        onClose={handleAlertClose}
        open={alertData.isAlertOpen}
        severity={alertData.alertSeverity}
        label={alertData.alertLabel}
        autoHideDuration={5000}
      />
      <Header menuOptions={menuOptions} />
      <Stack direction="row" useFlexGap spacing={5} sx={{ ...indent, mt: '2%' }}>
        <Card sx={{ maxWidth: 400 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="250"
              width="250"
              image="https://storage.googleapis.com/contract-ar-cdn/StockSnap_RKR8CFTODQ.jpg"
              alt="nuestra mision"
            />
            <CardContent>
              <Typography variant="h5">
                { indexLabels['mission.title'] }
              </Typography>
              <Typography variant="p">
                { indexLabels['mission.description']}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ maxWidth: 400 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="250"
              width="250"
              image="https://storage.googleapis.com/contract-ar-cdn/StockSnap_89AZTB8E5H.jpg"
              alt="como lo hacemos"
            />
            <CardContent>
              <Typography variant="h5">
                { indexLabels['howWeDoIt.title'] }
              </Typography>
              <Typography variant="p">
                { indexLabels['howWeDoIt.description']}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ maxWidth: 600 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="250"
              width="250"
              image="https://storage.googleapis.com/contract-ar-cdn/StockSnap_IHBPBLYUFE.jpg"
              alt="como lo hacemos"
            />
            <CardContent>
              <Typography variant="h5">
                { indexLabels['benefits.title'] }
              </Typography>
              <Box display="flex" flexDirection="row">
                <Box display="flex" flexDirection="column" sx={{ mt: '5%' }}>
                  <Typography variant="h6">
                    { indexLabels['benefits.forProviders.title'] }
                  </Typography>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    listStylePosition: 'inside',
                    padding: 0,
                    margin: 0,
                  }}
                  >
                    {
                        renderBenefits(indexLabels['benefits.forProviders.description'])
                  }
                  </ul>

                </Box>
                <Box display="flex" flexDirection="column" sx={{ mt: '5%', ml: '10%' }}>
                  <Typography variant="h6">
                    { indexLabels['benefits.forClients.title'] }
                  </Typography>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    listStylePosition: 'inside',
                    padding: 0,
                    margin: 0,
                  }}
                  >
                    {
            renderBenefits(indexLabels['benefits.forClients.description'])
          }
                  </ul>

                </Box>
              </Box>

            </CardContent>
          </CardActionArea>
        </Card>

      </Stack>
      <Footer />
    </Box>
  );
});

export default RootPage;
