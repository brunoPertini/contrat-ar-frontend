import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import Header from '../Header';
import withRouter from '../Shared/Components/HighOrderComponents/withRouter';
import InformativeAlert from '../Shared/Components/Alert';
import { routes } from '../Shared/Constants';
import { rootPageLabels } from '../StaticData/RootPage';
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';
import { signUpLabels } from '../StaticData/SignUp';
import { indexLabels } from '../StaticData/Index';
import Footer from '../Shared/Components/Footer';
import PlansSection from '../Shared/Components/PlansSection';
import FAQSection from '../Shared/Components/FAQSection';
import ContactForm from '../Shared/Components/ContactForm';
import { buildFooterOptions } from '../Shared/Helpers/UtilsHelper';
import { flexColumn } from '../Shared/Constants/Styles';
import { HttpClientFactory } from '../Infrastructure/HttpClientFactory';

const renderBenefits = (benefits) => benefits.split('.')
  .filter((line) => !!(line.trim()))
  .map((line, i) => (
    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
      <CheckIcon sx={{ mr: 1, mt: '2px' }} />
      <Typography variant="body2">{line.trim()}</Typography>
    </Box>
  ));

const indent = { marginLeft: '1%' };

const cardStyles = { maxWidth: { xs: '100%', sm: 400 }, width: '100%' };

const sectionStyles = {
  border: '1px solid #d1d1d1',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const actionAreaStyles = { cursor: 'default' };

const localStorageService = new LocalStorageService();

const footerOptions = buildFooterOptions(routes.index);

const getAllPlanes = () => {
  const client = HttpClientFactory.createProveedorHttpClient();
  return client.getAllPlanes();
};

const RootPage = withRouter(({ router }) => {
  const [alertData, setAlertData] = useState({
    isAlertOpen: false,
    alertLabel: '',
    alertSeverity: '',
  });

  const [plansData, setPlansData] = useState([]);

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

  const fetchPlanes = async () => {
    const plans = await getAllPlanes();
    setPlansData(plans);
  };

  useEffect(() => {
    fetchPlanes();
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

  return (
    <Box
      {...flexColumn}
      height="100%"
    >
      <InformativeAlert
        onClose={handleAlertClose}
        open={alertData.isAlertOpen}
        severity={alertData.alertSeverity}
        label={alertData.alertLabel}
        autoHideDuration={5000}
      />
      <Header menuOptions={menuOptions} />
      <Stack
        className="companyDescription"
        direction="column"
        spacing={5}
        sx={{ ...indent, ...sectionStyles }}
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          <Card sx={cardStyles}>
            <CardActionArea sx={actionAreaStyles}>
              <CardMedia
                component="img"
                sx={{ objectFit: 'cover', height: '100%' }}
                image={`${process.env.REACT_APP_CDN_URL}/index/first-section-1.png`}
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
            <CardActionArea sx={actionAreaStyles}>
              <CardMedia
                component="img"
                image={`${process.env.REACT_APP_CDN_URL}/index/first-section-2.png`}
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
        </Box>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          <Card sx={cardStyles}>
            <CardActionArea sx={actionAreaStyles}>
              <CardMedia
                component="img"
                image={`${process.env.REACT_APP_CDN_URL}/index/first-section-3.jpg`}
                alt="beneficios"
                sx={{ objectFit: 'cover', height: '100%' }}
              />
              <CardContent>
                <Box {...flexColumn}>
                  <Typography variant="h5">
                    { indexLabels['benefits.forProviders.title'] }
                  </Typography>
                  <Typography variant="body2">
                    { renderBenefits(indexLabels['benefits.forProviders.description'])}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={cardStyles}>
            <CardActionArea sx={actionAreaStyles}>
              <CardMedia
                component="img"
                image={`${process.env.REACT_APP_CDN_URL}/index/first-section-3.jpg`}
                alt="beneficios"
                sx={{ objectFit: 'cover', height: '100%' }}
              />
              <CardContent>
                <Box {...flexColumn}>
                  <Typography variant="h5">
                    { indexLabels['benefits.forClients.title'] }
                  </Typography>
                  <Typography variant="body2">
                    { renderBenefits(indexLabels['benefits.forClients.description'])}
                  </Typography>
                </Box>

              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Stack>
      <PlansSection plans={plansData} containerStyles={sectionStyles} />
      <FAQSection containerStyles={sectionStyles} />
      <ContactForm containerStyles={sectionStyles} />
      <Footer options={footerOptions} />
    </Box>
  );
});

export default RootPage;
