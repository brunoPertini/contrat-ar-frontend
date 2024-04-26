/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { createSelector } from 'reselect';
import { useState } from 'react';
import {
  FormControlLabel, Switch, Tab, Tabs
} from '@mui/material';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import { getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../Shared/Hooks/useExitAppDialog';
import { userProfileLabels } from '../StaticData/UserProfile';
import {
  CLIENTE, ROLE_PROVEEDOR_PRODUCTOS,
  ROLE_PROVEEDOR_SERVICIOS, USER_TYPE_CLIENTE
} from '../Shared/Constants/System';
import UserPersonalData from './PersonalData';
import SecurityData from './SecurityData';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const PERSONAL_DATA_TAB = <Tab label={userProfileLabels.personalData} />;

const MY_PLAN_TAB = <Tab label={userProfileLabels.myPlan} />;

const MESSAGES_TAB = <Tab label={userProfileLabels.myMessages} />;

const SECURITY_TAB = <Tab label={userProfileLabels.security} />;

function UserProfile({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);
  const [tabOption, setTabOption] = useState(0);
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

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

  const showExitAppModal = () => setIsExitAppModalOpen(true);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const handleTabOptionChange = (_, newValue) => {
    setTabOption(newValue);
  };

  const menuOptions = getUserMenuOptions([{ props: userInfo },
    { onClick: () => showExitAppModal() }]);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  const rolesTabs = {
    [CLIENTE]: [PERSONAL_DATA_TAB, SECURITY_TAB, MESSAGES_TAB],
    [ROLE_PROVEEDOR_PRODUCTOS]: [PERSONAL_DATA_TAB, SECURITY_TAB, MY_PLAN_TAB],
    [ROLE_PROVEEDOR_SERVICIOS]: [PERSONAL_DATA_TAB, SECURITY_TAB, MY_PLAN_TAB],
  };

  const usuarioType = userInfo.role === CLIENTE ? USER_TYPE_CLIENTE : null;

  const tabsComponents = {
    0: <UserPersonalData
      userToken={userInfo.token}
      userInfo={personalData}
      usuarioType={usuarioType}
      styles={{ mt: '10%', ml: '5%' }}
      isEditModeEnabled={isEditModeEnabled}
      inputProps={{ readOnly: !isEditModeEnabled, disabled: !isEditModeEnabled }}
    />,
    1: <SecurityData
      data={securityData}
      isEditModeEnabled={isEditModeEnabled}
      inputProps={{ readOnly: !isEditModeEnabled, disabled: !isEditModeEnabled }}
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
      <Grid item sx={{ height: '30%', ml: '5%' }}>
        <FormControlLabel control={<Switch />} label={userProfileLabels.modifyData} />
      </Grid>
    </Grid>

  );
}

export default withRouter(UserProfile);
