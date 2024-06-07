/* eslint-disable react/prop-types */
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from '../Header';
import UsuariosTable from './UsuariosTable';
import AdminFilters from './AdminFIlters';
import { USUARIO_TYPE_PROVEEDORES } from '../Shared/Constants/System';
import { sharedLabels } from '../StaticData/Shared';

const TAB_VALUES = ['usuarios', 'productos', 'servicios'];

const TABS_LABELS = ['Usuarios', 'Productos', 'Servicios'];

const TABS_COMPONENTS = {
  usuarios: (props) => <UsuariosTable {...props} />,
};

function AdminPage({ userInfo, usuariosInfo, menuOptions }) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState(USUARIO_TYPE_PROVEEDORES);

  return (
    <>
      <Header
        withMenuComponent
        renderNavigationLinks
        menuOptions={menuOptions}
        userInfo={userInfo}
      />
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
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
          <Typography variant="h5">
            { sharedLabels.showing }
            {' '}
            { usuarioTypeFilter }
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" sx={{ marginTop: '2%' }}>
          <AdminFilters
            usuarioTypeFilter={usuarioTypeFilter}
            setUsuarioTypeFilter={setUsuarioTypeFilter}
          />
          {TABS_COMPONENTS[tabOption]({
            usuarios: usuarioTypeFilter === USUARIO_TYPE_PROVEEDORES
              ? usuariosInfo.usuarios.proveedores : usuariosInfo.usuarios.clientes,
            usuarioTypeFilter,
          })}
        </Box>
      </Box>
    </>
  );
}

export default AdminPage;
