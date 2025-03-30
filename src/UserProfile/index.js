import PropTypes from 'prop-types';
import {
  useContext, useEffect, useMemo, useState,
} from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import Header from '../Header';
import { buildFooterOptions, getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../Shared/Hooks/useExitAppDialog';
import {
  CLIENTE, PROVEEDOR,
  USER_TYPE_CLIENTE,
} from '../Shared/Constants/System';
import UserPersonalData from './PersonalData';
import SecurityData from './SecurityData';
import { routes, systemConstants } from '../Shared/Constants';
import PlanData from './PlanData';
import { NavigationContext } from '../State/Contexts/NavigationContext';
import GoBackLink from '../Shared/Components/GoBackLink';
import { getUserInfoResponseShape } from '../Shared/PropTypes/Vendibles';
import InformativeAlert from '../Shared/Components/Alert';
import Footer from '../Shared/Components/Footer';
import Layout from '../Shared/Components/Layout';
import { flexColumn } from '../Shared/Constants/Styles';
import TwoFactorAuthentication from '../Shared/Components/TwoFactorAuthentication';
import { FORMAT_DMY, FORMAT_YMD, switchDateFormat } from '../Shared/Helpers/DatesHelper';
import PaymentData from './PaymentData';
import { NEED_APPROVAL_ATTRIBUTES, rolesTabs, TABS_NAMES } from './Constants';
import { userProfileLabels } from '../StaticData/UserProfile';

const footerOptions = buildFooterOptions(routes.userProfile);

function UserProfile({
  handleLogout, userInfo, confirmPlanChange, getAllPlanes,
  editCommonInfo, uploadProfilePhoto, requestChangeExists,
  isAdmin, getUserInfo, getPaymentsOfUser,
  paySubscription, cancelPlanChange,
}) {
  const queryParams = new URLSearchParams(window.location.search);

  const returnTab = queryParams.get('returnTab');

  const { setHandleGoBack } = useContext(NavigationContext);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);
  const [tabOption, setTabOption] = useState(TABS_NAMES.PERSONAL_DATA);

  const [personalData, setPersonalData] = useState({
    name: userInfo.name,
    surname: userInfo.surname,
    birthDate: userInfo.birthDate,
    location: userInfo.location,
    phone: userInfo.phone,
    active: userInfo.active,
    is2FaValid: userInfo.is2FaValid,
  });

  // eslint-disable-next-line no-unused-vars
  const [securityData, setSecurityData] = useState({
    email: userInfo.email,
    password: userInfo.password,
    confirmPassword: userInfo.password,
  });

  // planData can be changed, currentUserPlanData is only set once
  const [planData, setPlanData] = useState();
  const [currentUserPlanData, setCurrentUserPlanData] = useState();

  const [planesInfo, setPlanesInfo] = useState();

  const [changeRequestsMade, setChangeRequestsMade] = useState({
    suscripcion: null,
    email: null,
    password: null,
  });

  const [alertConfig, setAlertConfig] = useState({ open: false, label: '', severity: '' });

  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);
  const [show2FaComponent, setShow2FaComponent] = useState(false);

  const isProveedorUser = useMemo(() => userInfo.role.startsWith(systemConstants.PROVEEDOR), [userInfo]);

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
      (changeRequestId) => setChangeRequestsMade((previous) => ({
        ...previous, [attribute]: changeRequestId,
      })),
    )
      .catch(() => setChangeRequestsMade((previous) => ({ ...previous, [attribute]: null })));
  };

  const acceptSecurityDataChange = () => {
    const sanitizedBody = pickBy(
      securityData,
      (value, key) => key !== 'confirmPassword' && userInfo[key] !== securityData[key],
    );
    return editCommonInfo(sanitizedBody, tabOption);
  };

  useEffect(() => {
    // If user is proveedor, additional fields should be rendered
    if (isProveedorUser) {
      const { dni, fotoPerfilUrl } = userInfo;
      setPersonalData(
        (previous) => ({
          ...previous,
          dni,
          fotoPerfilUrl,
        }),
      );

      handleSetPlanesInfo();
      checkAttributeRequestChange([userInfo.id], 'suscripcion');
    }

    NEED_APPROVAL_ATTRIBUTES.forEach((attribute) => {
      checkAttributeRequestChange([userInfo.id], attribute);
    });

    setHandleGoBack(() => goToIndex);
  }, []);

  // For some reason, these data isn't changed automatically after update
  useEffect(() => {
    setPersonalData((previous) => ({ ...previous, fotoPerfilUrl: userInfo.fotoPerfilUrl }));
  }, [userInfo.fotoPerfilUrl]);

  useEffect(() => {
    setPersonalData((previous) => ({
      ...previous,
      birthDate: switchDateFormat({
        date: userInfo.birthDate,
        inputFormat: FORMAT_YMD,
        outputFormat: FORMAT_DMY,
      }),
    }));
  }, [userInfo.birthDate]);

  useEffect(() => {
    setPersonalData((previous) => ({ ...previous, active: userInfo.active }));
  }, [userInfo.active]);

  useEffect(() => {
    if (returnTab in TABS_NAMES) {
      setTabOption(returnTab);
    }
  }, [returnTab]);

  const showExitAppModal = () => setIsExitAppModalOpen(true);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const handleShow2FaComponent = () => setShow2FaComponent(true);

  const handleTabOptionChange = (_, newValue) => {
    setTabOption(newValue);
  };

  const handlePersonalDataChanged = (key, value) => setPersonalData(
    (previous) => ({
      ...previous,
      [key]: value,
    }),
  );

  const handleSecuritylDataChanged = (key, value) => setSecurityData(
    (previous) => ({
      ...previous,
      [key]: value,
    }),
  );

  const resetAlertData = () => {
    setAlertConfig({ open: false, label: '', severity: '' });
  };

  const handlePlanDataChanged = (newPlan) => setPlanData(newPlan);

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

    return confirmPlanChange(userInfo.id, planId).catch(() => {
      setAlertConfig({ label: userProfileLabels['plan.change.error'], severity: 'error', open: true });
      return Promise.reject();
    });
  };

  const handleCancelPlanChange = () => cancelPlanChange(changeRequestsMade.suscripcion).then(() => {
    setChangeRequestsMade((previous) => ({ ...previous, suscripcion: null }));
  });

  const on2FaPassed = () => {
    getUserInfo();
    setShow2FaComponent(false);
    setIsEditModeEnabled(true);
  };

  const tabsComponents = {
    [TABS_NAMES.PERSONAL_DATA]: useMemo(() => (
      <UserPersonalData
        userToken={userInfo.token}
        userInfo={personalData}
        changeUserInfo={handlePersonalDataChanged}
        editCommonInfo={editCommonInfo}
        uploadProfilePhoto={uploadProfilePhoto}
        isEditModeEnabled={isEditModeEnabled}
        setIsEditModeEnabled={setIsEditModeEnabled}
        show2FaComponent={handleShow2FaComponent}
        usuarioType={usuarioType}
        styles={{ pl: '2%', pb: '1%' }}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
      />
    ), [personalData, userInfo.token, isEditModeEnabled]),
    [TABS_NAMES.SECURITY]: useMemo(() => (tabOption === TABS_NAMES.SECURITY ? (
      <SecurityData
        data={securityData}
        setData={handleSecuritylDataChanged}
        usuarioType={usuarioType}
        styles={{ height: '100vh', minHeight: '100vh' }}
        isEditModeEnabled={isEditModeEnabled}
        setIsEditModeEnabled={setIsEditModeEnabled}
        is2FaValid={userInfo.is2FaValid}
        isAdmin={isAdmin}
        show2FaComponent={handleShow2FaComponent}
        handleConfirmEdition={acceptSecurityDataChange}
        handleLogout={handleLogout}
      />
    ) : null), [securityData, isAdmin, userInfo.is2FaValid, tabOption, isEditModeEnabled]),
    [TABS_NAMES.PLAN]: useMemo(() => (!isEmpty(planesInfo) ? (
      <PlanData
        plan={planData}
        actualPlan={currentUserPlanData}
        userLocation={personalData.location}
        changeUserInfo={handlePlanDataChanged}
        confirmPlanChange={handlePlanChangeConfirmation}
        planRequestChangeExists={!!changeRequestsMade.suscripcion}
        cancelPlanChange={handleCancelPlanChange}
        planesInfo={planesInfo}
        suscripcionData={userInfo.suscripcion}
        styles={{ height: '100vh', pl: '1%', pr: '1%' }}
        paySubscription={paySubscription}
      />
    ) : null), [planData, userInfo.suscripcion, personalData.location,
      changeRequestsMade.suscripcion, planesInfo]),
    [TABS_NAMES.MY_PAYMENTS]: useMemo(() => (isProveedorUser ? (
      <PaymentData
        subscriptionId={userInfo.suscripcion.id}
        canPaySubscription={userInfo.suscripcion.validity.canBePayed}
        isSubscriptionValid={userInfo.suscripcion.validity.valid}
        getPayments={getPaymentsOfUser}
        paySubscription={paySubscription}
      />
    ) : null), [userInfo]),
  };

  if (!(userInfo?.role)) {
    return null;
  }

  return (
    <Box
      {...flexColumn}
      height="100vh"
      minHeight="100vh"
    >

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
      <Layout gridProps={{ sx: { ...flexColumn } }}>
        <GoBackLink styles={{ pl: '1%' }} />
        {show2FaComponent ? (
          <TwoFactorAuthentication
            userToken={userInfo.token}
            onVerificationSuccess={on2FaPassed}
            handleLogout={handleLogout}
          />
        ) : (
          <>
            <Tabs
              value={tabOption}
              onChange={handleTabOptionChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {rolesTabs[userInfo.role]?.map((tab) => tab)}
            </Tabs>
            {tabsComponents[tabOption]}
          </>
        )}
      </Layout>

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
  getUserInfo: PropTypes.func.isRequired,
  getPaymentsOfUser: PropTypes.func.isRequired,
  paySubscription: PropTypes.func.isRequired,
  cancelPlanChange: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default UserProfile;
