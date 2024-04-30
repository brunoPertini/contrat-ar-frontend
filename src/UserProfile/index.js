/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState } from 'react';
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
  CLIENTE, ROLE_PROVEEDOR_PRODUCTOS,
  ROLE_PROVEEDOR_SERVICIOS, USER_TYPE_CLIENTE
} from '../Shared/Constants/System';
import UserPersonalData from './PersonalData';
import SecurityData from './SecurityData';
import { sharedLabels } from '../StaticData/Shared';

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

  const handleEditModeChange = (event) => {
    setIsEditModeEnabled(event.target.checked);
  };

  const handleTabOptionChange = (_, newValue) => {
    setTabOption(newValue);
  };

  const handlePersonalDataChanged = (key, value) => setPersonalData(
    (previous) => ({
      ...previous,
      [key]: value
    })
  );

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
      changeUserInfo={handlePersonalDataChanged}
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
      {
        tabOption === 0 && (
          <Grid
            item
            display="flex"
            flexDirection="column"
            sx={{ height: '30%', ml: '5%' }}
          >
            <FormControlLabel
              control={<Switch />}
              label={userProfileLabels.modifyData}
              onChange={handleEditModeChange}
            />
            <Button variant="contained" sx={{ mt: '5%' }}>
              { sharedLabels.finish }
            </Button>
          </Grid>
        )
      }
    </Grid>

  );
}

export default withRouter(UserProfile);
