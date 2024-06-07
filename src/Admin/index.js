/* eslint-disable react/prop-types */
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Header from '../Header';
import UsuariosTable from './UsuariosTable';
import AdminFilters from './AdminFIlters';

const TAB_VALUES = ['usuarios', 'productos', 'servicios'];

const TABS_LABELS = ['Usuarios', 'Productos', 'Servicios'];

const TABS_COMPONENTS = {
  usuarios: (props) => <UsuariosTable {...props} />,
};

function AdminPage({ userInfo, usuariosInfo, menuOptions }) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);

  return (
    <>
      <Header
        withMenuComponent
        renderNavigationLinks
        menuOptions={menuOptions}
        userInfo={userInfo}
      />
      <Box>
        <Tabs value={tabOption} onChange={setTabOption}>
          {
          TABS_LABELS.map((label, index) => (
            <Tab
              key={`admin_page_tab${index}`}
              label={label}
              value={TAB_VALUES[index]}
            />
          ))
        }
        </Tabs>
        <Box display="flex" flexDirection="column" sx={{ marginTop: '2%' }}>
          <AdminFilters />
          {TABS_COMPONENTS[tabOption](usuariosInfo)}
        </Box>
      </Box>
    </>
  );
}

export default AdminPage;
