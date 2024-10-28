import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import InformativeAlert from '../Shared/Components/Alert';
import { routes } from '../Shared/Constants';
import { rootPageLabels } from '../StaticData/RootPage';
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';
import { signUpLabels } from '../StaticData/SignUp';
import { indexLabels } from '../StaticData/Index';

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
      <Stack direction="column" useFlexGap spacing={2}>
        <Typography variant="h5" sx={{ marginLeft: '1%' }}>
          { indexLabels['mission.title'] }
        </Typography>
        <Typography variant="p">
          { indexLabels['mission.description']}
        </Typography>
        <Typography variant="h5">
          { indexLabels['howWeDoIt.title'] }
        </Typography>
        <Typography variant="p">
          { indexLabels['howWeDoIt.description']}
        </Typography>
        <Typography variant="h5">
          { indexLabels['benefits.title'] }
        </Typography>
        <Box sx={{ marginLeft: '2%' }}>
          <Typography variant="h5">
            { indexLabels['benefits.forProviders.title'] }
          </Typography>
        </Box>

      </Stack>
    </Box>
  );
});

export default RootPage;
