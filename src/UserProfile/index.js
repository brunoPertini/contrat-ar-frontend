/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import isEmpty from 'lodash/isEmpty';
import Header from '../Header';
import { getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../Shared/Hooks/useExitAppDialog';
import { userProfileLabels } from '../StaticData/UserProfile';
import {
  CLIENTE, PROVEEDOR, ROLE_PROVEEDOR_PRODUCTOS,
  ROLE_PROVEEDOR_SERVICIOS, USER_TYPE_CLIENTE,
} from '../Shared/Constants/System';
import UserPersonalData from './PersonalData';
import SecurityData from './SecurityData';
import { systemConstants } from '../Shared/Constants';
import PlanData from './PlanData';
import { NavigationContext } from '../State/Contexts/NavigationContext';
import GoBackLink from '../Shared/Components/GoBackLink';
import { getUserInfoResponseShape } from '../Shared/PropTypes/Vendibles';
import { DialogModal, StaticAlert } from '../Shared/Components';
import { sharedLabels } from '../StaticData/Shared';
import { adminLabels } from '../StaticData/Admin';
import InformativeAlert from '../Shared/Components/Alert';
import Footer from '../Shared/Components/Footer';
import { indexLabels } from '../StaticData/Index';

const TABS_NAMES = {
  PERSONAL_DATA: 'PERSONAL_DATA',
  SECURITY: 'SECURITY',
  PLAN: 'PLAN',
  MESSAGES_CLIENT: 'MESSAGES_CLIENT',
  MESSAGES_PROVIDER: 'MESSAGES_PROVIDER',
};

const PERSONAL_DATA_TAB = (
  <Tab
    label={userProfileLabels.personalData}
    value={TABS_NAMES.PERSONAL_DATA}
  />
);

const MY_PLAN_TAB = <Tab label={userProfileLabels.myPlan} value={TABS_NAMES.PLAN} />;

const MESSAGES_TAB_CLIENT = (
  <Tab
    label={userProfileLabels.myMessages}
    value={TABS_NAMES.MESSAGES_CLIENT}
  />
);

const MESSAGES_TAB_PROVIDER = (
  <Tab
    label={userProfileLabels.myMessagesProvider}
    value={TABS_NAMES.MESSAGES_PROVIDER}
  />
);

const SECURITY_TAB = <Tab label={userProfileLabels.security} value={TABS_NAMES.SECURITY} />;

const rolesTabs = {
  [CLIENTE]: [PERSONAL_DATA_TAB, SECURITY_TAB, MESSAGES_TAB_CLIENT],
  [ROLE_PROVEEDOR_PRODUCTOS]: [PERSONAL_DATA_TAB,
    SECURITY_TAB, MY_PLAN_TAB, MESSAGES_TAB_PROVIDER],
  [ROLE_PROVEEDOR_SERVICIOS]: [PERSONAL_DATA_TAB,
    SECURITY_TAB, MY_PLAN_TAB, MESSAGES_TAB_PROVIDER],
};

const NEED_APPROVAL_ATTRIBUTES = ['email', 'password'];

const accountActiveModalDefaultValues = {
  title: '',
  text: '',
  handleAccept: () => {},
  checked: undefined,
};

const footerOptions = [
  { label: indexLabels.helpAndQuestions, onClick: () => {} },
  { label: indexLabels.termsAndConditions, onClick: () => {} },
];

function UserProfile({
  handleLogout, userInfo, confirmPlanChange, getAllPlanes,
  editCommonInfo, uploadProfilePhoto, requestChangeExists,
  isAdmin,
}) {
  const { setHandleGoBack } = useContext(NavigationContext);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);
  const [tabOption, setTabOption] = useState(TABS_NAMES.PERSONAL_DATA);

  const [personalData, setPersonalData] = useState({
    name: userInfo.name,
    surname: userInfo.surname,
    birthDate: userInfo.birthDate,
    location: userInfo.location,
    phone: userInfo.phone,
    fotoPerfilUrl: userInfo.fotoPerfilUrl,
  });

  // eslint-disable-next-line no-unused-vars
  const [securityData, setSecurityData] = useState({
    email: userInfo.email,
    password: userInfo.password,
  });

  // planData can be changed, currentUserPlanData is only set once
  const [planData, setPlanData] = useState();
  const [currentUserPlanData, setCurrentUserPlanData] = useState();

  const [planesInfo, setPlanesInfo] = useState();

  const [changeRequestsMade, setChangeRequestsMade] = useState({
    plan: false,
    email: false,
    password: false,
  });

  const [accountActiveModalContent, setAccountActiveModalContent] = useState(
    accountActiveModalDefaultValues,
  );

  const [alertConfig, setAlertConfig] = useState({ open: false, label: '', severity: '' });

  const goToIndex = () => {
    window.location.href = userInfo.indexPage;
  };

  const handleSetPlanesInfo = async () => {
    const fetchedPlanesInfo = await getAllPlanes();
    setPlanesInfo(fetchedPlanesInfo);
    const userPlanData = fetchedPlanesInfo.find((p) => p.id === userInfo.suscripcion.planId);
    setPlanData(userPlanData.type);
    setCurrentUserPlanData(userPlanData.type);
  };

  const checkAttributeRequestChange = (sourceTableId, attribute) => {
    requestChangeExists(sourceTableId, [attribute]).then(
      () => setChangeRequestsMade((previous) => ({
        ...previous, [attribute]: true,
      })),
    )
      .catch(() => setChangeRequestsMade((previous) => ({ ...previous, [attribute]: false })));
  };

  useEffect(() => {
    // If user is proveedor, additional fields should be rendered
    if (userInfo.role.startsWith(systemConstants.PROVEEDOR)) {
      const { dni } = userInfo;
      setPersonalData(
        (previous) => ({
          ...previous,
          dni,
        }),
      );

      handleSetPlanesInfo();
      checkAttributeRequestChange([userInfo.suscripcion.id], 'plan');
    }

    NEED_APPROVAL_ATTRIBUTES.forEach((attribute) => {
      checkAttributeRequestChange([userInfo.id], attribute);
    });

    setHandleGoBack(() => goToIndex);
  }, []);

  useEffect(() => {
    // For some reason, fotoPerfilUrl is not updated automatically when userInfo changes
    setPersonalData((previous) => ({ ...previous, fotoPerfilUrl: userInfo.fotoPerfilUrl }));
  }, [userInfo.fotoPerfilUrl]);

  const showExitAppModal = () => setIsExitAppModalOpen(true);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const handleTabOptionChange = (_, newValue) => {
    setTabOption(newValue);
  };

  const handlePersonalDataChanged = (key, value) => setPersonalData(
    (previous) => ({
      ...previous,
      [key]: value,
    }),
  );

  const resetAlertData = () => {
    setAlertConfig({ open: false, label: '', severity: '' });
  };

  const handlePlanDataChanged = (newPlan) => setPlanData(newPlan);

  const handleAcceptChangeIsUserActive = (active) => editCommonInfo({
    active,
  }).then(() => {
    setAlertConfig({
      open: true,
      label: active ? adminLabels.accountEnabled : adminLabels.accountDisabled,
      severity: 'info',
    });
  }).catch(() => setAlertConfig({
    open: true,
    label: adminLabels.unexpectedError,
    severity: 'error',
  })).finally(() => setAccountActiveModalContent(accountActiveModalDefaultValues));

  const openUserActiveModal = (event) => {
    setAccountActiveModalContent({
      text: event.target.checked
        ? adminLabels.enableAccountQuestion : adminLabels.disableAccountQuestion,
      handleAccept: handleAcceptChangeIsUserActive,
      checked: event.target.checked,
    });
  };

  const menuOptionsConfig = {
    myProfile: {
      props: userInfo,
    },
    logout: {
      onClick: () => showExitAppModal(),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  const usuarioType = userInfo.role === CLIENTE ? USER_TYPE_CLIENTE : PROVEEDOR;

  const handlePlanChangeConfirmation = (newPlanType) => {
    const planId = planesInfo.find((p) => p.type === newPlanType).id;

    return confirmPlanChange(userInfo.id, planId);
  };

  const tabsComponents = {
    [TABS_NAMES.PERSONAL_DATA]: useMemo(() => (
      <UserPersonalData
        userToken={userInfo.token}
        userInfo={personalData}
        changeUserInfo={handlePersonalDataChanged}
        editCommonInfo={editCommonInfo}
        uploadProfilePhoto={uploadProfilePhoto}
        usuarioType={usuarioType}
        styles={{ pl: '2%', pb: '1%' }}
        isAdmin={isAdmin}
      />
    ), [personalData, userInfo.token]),
    [TABS_NAMES.SECURITY]: useMemo(() => (tabOption === TABS_NAMES.SECURITY ? (
      <SecurityData
        data={securityData}
        usuarioType={usuarioType}
        styles={{ height: '100vh', minHeight: '100vh' }}
        requestChangeExists={changeRequestsMade.email || changeRequestsMade.password}
      />
    ) : null), [securityData, changeRequestsMade.email, changeRequestsMade.password, tabOption]),
    [TABS_NAMES.PLAN]: useMemo(() => (!isEmpty(planesInfo) ? (
      <PlanData
        plan={planData}
        actualPlan={currentUserPlanData}
        userLocation={personalData.location}
        changeUserInfo={handlePlanDataChanged}
        confirmPlanChange={handlePlanChangeConfirmation}
        planRequestChangeExists={changeRequestsMade.plan}
        planesInfo={planesInfo}
        suscripcionData={userInfo.suscripcion}
        styles={{ height: '100vh', pl: '1%', pr: '1%' }}
      />
    ) : null), [planData, userInfo.suscripcion, personalData.location,
      changeRequestsMade.plan, planesInfo]),
  };

  const activeAlert = useMemo(() => (!isAdmin ? null : !userInfo.active ? (
    <StaticAlert
      severity="warning"
      variant="outlined"
      label={sharedLabels.inactiveAccount}
      styles={{ mt: '5%' }}
    />
  ) : (
    <StaticAlert
      severity="info"
      variant="outlined"
      label={sharedLabels.activeAccount}
      styles={{ mt: '5%' }}
    />
  )), [isAdmin, userInfo.active]);

  const UserActiveModal = useCallback(() => (
    <DialogModal
      title={sharedLabels.pleaseConfirmAction}
      contextText={accountActiveModalContent.text}
      cancelText={sharedLabels.cancel}
      acceptText={sharedLabels.accept}
      open={!!(accountActiveModalContent.text)}
      handleAccept={
          () => accountActiveModalContent.handleAccept(accountActiveModalContent.checked)
        }
      handleDeny={() => setAccountActiveModalContent(accountActiveModalDefaultValues)}
    />
  ), [accountActiveModalContent.text]);

  if (!(userInfo?.role)) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      minHeight="100vh"
    >

      <UserActiveModal />
      <InformativeAlert
        open={alertConfig.open}
        onClose={() => resetAlertData()}
        label={alertConfig.label}
        severity={alertConfig.severity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      { ExitAppDialog }
      <Header
        userInfo={userInfo}
        renderNavigationLinks
        withMenuComponent
        menuOptions={menuOptions}
      />
      <Box display="flex" flexDirection="column">
        <GoBackLink styles={{ pl: '1%' }} />
        <Tabs
          value={tabOption}
          onChange={handleTabOptionChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          { rolesTabs[userInfo.role].map((tab) => tab) }
        </Tabs>
        { tabsComponents[tabOption] }
      </Box>
      {
        isAdmin && (
          <Box display="flex" flexDirection="column" sx={{ mt: '3%', ml: '3%' }}>
            { activeAlert }
            <FormControlLabel
              control={(
                <Switch
                  checked={userInfo.active}
                  onChange={openUserActiveModal}
                />
)}
              label={userInfo.active ? adminLabels.disableAccount : adminLabels.enableAccount}
            />
          </Box>
        )
      }
      <Footer options={footerOptions} />
    </Box>

  );
}

UserProfile.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  editCommonInfo: PropTypes.func.isRequired,
  uploadProfilePhoto: PropTypes.func.isRequired,
  confirmPlanChange: PropTypes.func.isRequired,
  requestChangeExists: PropTypes.func.isRequired,
  getAllPlanes: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default UserProfile;
