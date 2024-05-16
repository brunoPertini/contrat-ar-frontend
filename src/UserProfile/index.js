import PropTypes from 'prop-types';
import {
  useContext, useEffect, useMemo, useState,
} from 'react';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

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

function UserProfile({
  handleLogout, userInfo, confirmPlanChange,
  editCommonInfo, uploadProfilePhoto, planRequestChangeExists,
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

  const [planData, setPlanData] = useState(userInfo.plan);

  const [changeRequestsMade, setChangeRequestsMade] = useState({
    plan: false,
  });

  const goToIndex = () => {
    window.location.href = userInfo.indexPage;
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

      planRequestChangeExists(planData).then(() => setChangeRequestsMade({ plan: true }))
        .catch(() => setChangeRequestsMade({ plan: false }));
    }

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

  const handlePlanDataChanged = (newPlan) => setPlanData(newPlan);

  const menuOptions = getUserMenuOptions([{ props: userInfo },
    { onClick: () => showExitAppModal() }]);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  const usuarioType = userInfo.role === CLIENTE ? USER_TYPE_CLIENTE : PROVEEDOR;

  const tabsComponents = {
    [TABS_NAMES.PERSONAL_DATA]: useMemo(() => (
      <UserPersonalData
        userToken={userInfo.token}
        userInfo={personalData}
        changeUserInfo={handlePersonalDataChanged}
        editCommonInfo={editCommonInfo}
        uploadProfilePhoto={uploadProfilePhoto}
        usuarioType={usuarioType}
        styles={{ mt: '10%', ml: '5%' }}
      />
    ), [personalData, userInfo.token]),
    [TABS_NAMES.SECURITY]: useMemo(() => (
      <SecurityData
        data={securityData}
      />
    ), [securityData]),
    [TABS_NAMES.PLAN]: useMemo(() => (userInfo.plan ? (
      <PlanData
        plan={planData}
        actualPlan={userInfo.plan}
        userLocation={personalData.location}
        changeUserInfo={handlePlanDataChanged}
        confirmPlanChange={confirmPlanChange}
        planRequestChangeExists={changeRequestsMade.plan}
      />
    ) : null), [planData, userInfo.plan, personalData.location]),
  };

  return (
    <Grid container display="flex">
      { ExitAppDialog }
      <Header
        userInfo={userInfo}
        renderNavigationLinks
        withMenuComponent
        menuOptions={menuOptions}
      />
      <Grid item>
        <GoBackLink />
        <Tabs value={tabOption} onChange={handleTabOptionChange}>
          { rolesTabs[userInfo.role].map((tab) => tab) }
        </Tabs>
        { tabsComponents[tabOption] }
      </Grid>
    </Grid>

  );
}

UserProfile.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  editCommonInfo: PropTypes.func.isRequired,
  uploadProfilePhoto: PropTypes.func.isRequired,
  confirmPlanChange: PropTypes.func.isRequired,
  planRequestChangeExists: PropTypes.func.isRequired,
};

export default UserProfile;
