import PropTypes from 'prop-types';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from '../Header';
import UsuariosTable from './UsuariosTable';
import AdminFilters from './AdminFilters';
import { USUARIO_TYPE_PROVEEDORES } from '../Shared/Constants/System';
import { sharedLabels } from '../StaticData/Shared';
import { getUserInfoResponseShape } from '../Shared/PropTypes/Vendibles';
import { getUsuariosAdminResponseShape } from '../Shared/PropTypes/Admin';
import { planShape } from '../Shared/PropTypes/Proveedor';
import { menuOptionsShape } from '../Shared/PropTypes/Header';

const TAB_VALUES = ['usuarios', 'productos', 'servicios'];

const TABS_LABELS = ['Usuarios', 'Productos', 'Servicios'];

const TABS_COMPONENTS = {
  usuarios: (props) => <UsuariosTable {...props} />,
};

const filtersDefaultValues = {
  name: '', surname: '', email: '', showOnlyActives: false, plan: null,
};

function AdminPage({
  userInfo, usuariosInfo, planesInfo, menuOptions, applyFilters, loginAsUser, deleteUser,
}) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState(USUARIO_TYPE_PROVEEDORES);

  const [filters, setFilters] = useState(filtersDefaultValues);

  const handleApplyFilters = () => {
    applyFilters({ type: usuarioTypeFilter, filters });
  };

  const handleSetFilters = (key, value) => {
    const shouldNotApplyFilters = ['name', 'surname', 'email'].includes(key);
    if (!shouldNotApplyFilters) {
      applyFilters({ type: usuarioTypeFilter, filters: { ...filters, [key]: value } });
    }
    return setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const handleApplyUsuarioTypeFilter = async (value) => {
    if (usuarioTypeFilter !== value) {
      await applyFilters({ type: value, filters: { showOnlyActives: false } });
      setUsuarioTypeFilter(value);
      setFilters(filtersDefaultValues);
    }
  };

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
            setUsuarioTypeFilter={handleApplyUsuarioTypeFilter}
            filters={filters}
            setFilters={handleSetFilters}
            applyFilters={handleApplyFilters}
            planesInfo={planesInfo}
          />
          {TABS_COMPONENTS[tabOption]({
            usuarios: usuarioTypeFilter === USUARIO_TYPE_PROVEEDORES
              ? usuariosInfo.usuarios.proveedores : usuariosInfo.usuarios.clientes,
            usuarioTypeFilter,
            loginAsUser,
            deleteUser,
          })}
        </Box>
      </Box>
    </>
  );
}

AdminPage.defaultProps = {
  usuariosInfo: {
    usuarios: {
      clientes: [],
      proveedores: [],
    },

  },
};

AdminPage.defaultProps = {
  planesInfo: [],
};

AdminPage.propTypes = {
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  usuariosInfo: PropTypes.shape(getUsuariosAdminResponseShape),
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)),
  menuOptions: PropTypes.arrayOf(PropTypes.shape(menuOptionsShape)).isRequired,
  applyFilters: PropTypes.func.isRequired,
  loginAsUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default AdminPage;
