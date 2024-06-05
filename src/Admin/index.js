/* eslint-disable react/prop-types */
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import Header from '../Header';

const TAB_VALUES = ['usuarios', 'productos', 'servicios'];

const TABS_LABELS = ['Usuarios', 'Productos', 'Servicios'];

function AdminPage({ userInfo, menuOptions }) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);

  return (
    <>
      <Header
        withMenuComponent
        renderNavigationLinks
        menuOptions={menuOptions}
        userInfo={userInfo}
      />
      <Tabs value={tabOption} onChange={setTabOption}>
        {
          TABS_LABELS.map((label, index) => <Tab label={label} value={TAB_VALUES[index]} />)
        }
      </Tabs>
    </>
  );
}

export default AdminPage;
