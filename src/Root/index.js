import { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardActionArea, CardContent, CardMedia, Divider, Stack, Typography,
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
import { getPlanLabel, getPlanDescription } from '../Shared/Helpers/PlanesHelper';
import { sharedLabels } from '../StaticData/Shared';
import { getLocaleCurrencySymbol } from '../Shared/Helpers/PricesHelper';
import { ARGENTINA_LOCALE } from '../Shared/Constants/System';

const localStorageService = new LocalStorageService();

const plans = [
  {
    id: 1,
    descripcion: 'Cualquier persona dentro del radio de ejemplo que el mapa muestra te va a poder encontrar.',
    type: 'FREE',
    value: 0,
  },
  {
    id: 2,
    descripcion: 'Un radio de alcance completo para que cualquier persona en tu país te pueda encontrar. Un perfil completamente personalizado, donde vas a poder subir tus trabajos hechos, y recibir la opinión sobre ellos de tus clientes. La posibilidad de acceder a nuestro plan de beneficios, donde podrás ganar bonos por cada trabajo hecho.',
    type: 'PAID',
    value: 500,
  },
];

function PricingSection() {
  return (
    <Box
      sx={{
        py: 5, px: 2, backgroundColor: '#f4f4f9', textAlign: 'center',
      }}
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        Nuestros Planes
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        gap={4}
        mt={4}
      >
        {plans.map((plan, index) => (
          <Card
            key={index}
            display="flex"
            flexDirection="column"
            sx={{
              height: '100%',
              maxWidth: 345,
              borderRadius: 3,
              flex: '1 1 300px',
              justifyContent: 'space-between',
            }}
          >
            <CardContent
              display="flex"
              flexDirection="column"
              sx={{ flexGrow: 1 }}
            >
              <Typography variant="h5" fontWeight="bold">
                { getPlanLabel(plan.id)}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ my: 2 }}>
                { sharedLabels.finalMonthlyPrice.replace(
                  '{price}',
                  getLocaleCurrencySymbol(ARGENTINA_LOCALE) + plan.value,
                )}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                { getPlanDescription(plan.type, plans, false) }
              </Box>
            </CardContent>
            <Box display="flex" flexDirection="column" alignSelf="flex-end">
              <Button variant="contained" color="primary" fullWidth>
                ¡Suscríbete!
              </Button>
            </Box>

          </Card>
        ))}
      </Box>
    </Box>
  );
}

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

  const cardStyles = { maxWidth: { xs: '100%', sm: 400 }, width: '100%' };

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
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={5}
        sx={{ ...indent, mt: '2%' }}
      >
        <Card sx={cardStyles}>
          <CardActionArea>
            <CardMedia
              component="img"
              sx={{ objectFit: 'cover', height: '100%' }}
              image="https://storage.googleapis.com/contract-ar-cdn/StockSnap_RKR8CFTODQ.jpg"
              alt="nuestra mision"
            />
            <CardContent>
              <Typography variant="h5">
                { indexLabels['mission.title'] }
              </Typography>
              <Typography variant="body2">
                { indexLabels['mission.description']}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={cardStyles}>
          <CardActionArea>
            <CardMedia
              component="img"
              image="https://storage.googleapis.com/contract-ar-cdn/StockSnap_89AZTB8E5H.jpg"
              alt="como lo hacemos"
              sx={{ objectFit: 'cover', height: '100%' }}
            />
            <CardContent>
              <Typography variant="h5">
                { indexLabels['howWeDoIt.title'] }
              </Typography>
              <Typography variant="body2">
                { indexLabels['howWeDoIt.description']}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={cardStyles}>
          <CardActionArea>
            <CardMedia
              component="img"
              image="https://storage.googleapis.com/contract-ar-cdn/StockSnap_IHBPBLYUFE.jpg"
              alt="beneficios"
              sx={{ objectFit: 'cover', height: '100%' }}
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
      <PricingSection />
      <Footer />
    </Box>
  );
});

export default RootPage;
