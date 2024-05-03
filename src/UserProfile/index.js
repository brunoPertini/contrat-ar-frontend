/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Button from '@mui/material/Button';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import { getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../Shared/Hooks/useExitAppDialog';
import { userProfileLabels } from '../StaticData/UserProfile';
import {
  CLIENTE, PROVEEDOR, ROLE_PROVEEDOR_PRODUCTOS,
  ROLE_PROVEEDOR_SERVICIOS, USER_TYPE_CLIENTE
} from '../Shared/Constants/System';
import UserPersonalData from './PersonalData';
import SecurityData from './SecurityData';
import { sharedLabels } from '../StaticData/Shared';
import { systemConstants } from '../Shared/Constants';
import PlanData from './PlanData';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

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

function UserProfile({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);
  const [tabOption, setTabOption] = useState(TABS_NAMES.PERSONAL_DATA);

  const [personalData, setPersonalData] = useState({
    name: userInfo.name,
    surname: userInfo.surname,
    birthDate: userInfo.birthDate,
    location: userInfo.location,
    phone: userInfo.phone,
  });

  const [securityData, setSecurityData] = useState({
    email: userInfo.email,
    password: userInfo.password
  });

  const [planData, setPlanData] = useState(userInfo.plan);

  // If user is proveedor, additional fields should be rendered
  useEffect(() => {
    if (userInfo.role.startsWith(systemConstants.PROVEEDOR)) {
      const { dni } = userInfo;
      setPersonalData(
        (previous) => ({
          ...previous,
          dni,
        })
      );
    }
  }, []);

  const showExitAppModal = () => setIsExitAppModalOpen(true);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const handleTabOptionChange = (_, newValue) => {
    setTabOption(newValue);
  };

  const handlePersonalDataChanged = (key, value) => setPersonalData(
    (previous) => ({
      ...previous,
      [key]: value
    })
  );

  const handlePlanDataChanged = (newPlan) => setPlanData(newPlan);

  const menuOptions = getUserMenuOptions([{ props: userInfo },
    { onClick: () => showExitAppModal() }]);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  const rolesTabs = {
    [CLIENTE]: [PERSONAL_DATA_TAB, SECURITY_TAB, MESSAGES_TAB_CLIENT],
    [ROLE_PROVEEDOR_PRODUCTOS]: [PERSONAL_DATA_TAB,
      SECURITY_TAB, MY_PLAN_TAB, MESSAGES_TAB_PROVIDER],
    [ROLE_PROVEEDOR_SERVICIOS]: [PERSONAL_DATA_TAB,
      SECURITY_TAB, MY_PLAN_TAB, MESSAGES_TAB_PROVIDER],
  };

  const usuarioType = userInfo.role === CLIENTE ? USER_TYPE_CLIENTE : PROVEEDOR;

  const tabsComponents = {
    [TABS_NAMES.PERSONAL_DATA]: <UserPersonalData
      userToken={userInfo.token}
      userInfo={personalData}
      changeUserInfo={handlePersonalDataChanged}
      usuarioType={usuarioType}
      styles={{ mt: '10%', ml: '5%' }}
    />,
    [TABS_NAMES.SECURITY]: <SecurityData
      data={securityData}
    />,
    [TABS_NAMES.PLAN]: <PlanData
      plan={planData}
      actualPlan={userInfo.plan}
      userLocation={personalData.location}
      changeUserInfo={handlePlanDataChanged}
    />
  };

  return (
    <Grid container display="flex">
      { ExitAppDialog }
      <Header userInfo={userInfo} withMenuComponent menuOptions={menuOptions} />
      <Grid item>
        <Tabs value={tabOption} onChange={handleTabOptionChange}>
          { rolesTabs[userInfo.role].map((tab) => tab) }
        </Tabs>
        { tabsComponents[tabOption] }
      </Grid>
    </Grid>

  );
}

export default withRouter(UserProfile);
