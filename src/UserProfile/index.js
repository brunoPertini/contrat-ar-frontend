/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { createSelector } from 'reselect';
import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import { getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import useExitAppDialog from '../Shared/Hooks/useExitAppDialog';
import { userProfileLabels } from '../StaticData/UserProfile';
import { CLIENTE, ROLE_PROVEEDOR_PRODUCTOS, ROLE_PROVEEDOR_SERVICIOS } from '../Shared/Constants/System';
import UserPersonalData from './PersonalData';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const PERSONAL_DATA_TAB = <Tab label={userProfileLabels.personalData} />;

const MY_PLAN_TAB = <Tab label={userProfileLabels.myPlan} />;

const MESSAGES_TAB = <Tab label={userProfileLabels.myMessages} />;

function UserProfile({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);
  const [tabOption, setTabOption] = useState(0);
  const [personalData, setPersonalData] = useState({
    name: userInfo.name,
    surname: userInfo.surname,
    email: userInfo.email,
    birthDate: userInfo.birthDate,
    location: userInfo.location,
    phone: userInfo.phone,
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
    [CLIENTE]: [PERSONAL_DATA_TAB, MESSAGES_TAB],
    [ROLE_PROVEEDOR_PRODUCTOS]: [PERSONAL_DATA_TAB, MY_PLAN_TAB],
    [ROLE_PROVEEDOR_SERVICIOS]: [PERSONAL_DATA_TAB, MY_PLAN_TAB],
  };

  const tabsComponents = {
    0: <UserPersonalData userInfo={personalData} styles={{ mt: '10%', ml: '5%' }} />
  };

  return (
    <Grid container>
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
