import { useEffect, useState } from 'react';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import InformativeAlert from '../Shared/Components/Alert';
import { routes } from '../Shared/Constants';
import { rootPageLabels } from '../StaticData/RootPage';
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';
import { signUpLabels } from '../StaticData/SignUp';

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

    if (comesFromSignup === true && success === true) {
      return setAlertData({
        isAlertOpen: true,
        alertLabel: signUpLabels['signup.success'],
        alertSeverity: 'success',
      });
    }

    if (comesFromSignup === true && success === false) {
      return setAlertData({
        isAlertOpen: true,
        alertLabel: signUpLabels['signup.error'],
        alertSeverity: 'error',
      });
    }

    return handleAlertClose();
  }, []);

  return (
    <>
      <InformativeAlert
        onClose={handleAlertClose}
        open={alertData.isAlertOpen}
        severity={alertData.alertSeverity}
        label={alertData.alertLabel}
        autoHideDuration={5000}
      />
      <Header menuOptions={menuOptions} />
    </>
  );
});

export default RootPage;
