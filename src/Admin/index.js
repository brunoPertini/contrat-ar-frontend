import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
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
import VendblesTable from './VendiblesTable';

const TAB_VALUES = ['usuarios', 'productos', 'servicios'];

const TABS_LABELS = ['Usuarios', 'Productos', 'Servicios'];

const TABS_COMPONENTS = {
  usuarios: (props) => <UsuariosTable {...props} />,
  productos: (props) => <VendblesTable {...props} />,
  servicios: (props) => <VendblesTable {...props} />,
};

const filtersDefaultValues = {
  name: '', surname: '', email: '', showOnlyActives: false, plan: null,
};

function AdminPage({
  userInfo, usuariosInfo, planesInfo,
  menuOptions, applyFilters, loginAsUser, deleteUser, fetchProductos, fetchServicios,
}) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState(USUARIO_TYPE_PROVEEDORES);

  const [filters, setFilters] = useState(filtersDefaultValues);
  const [vendibles, setVendibles] = useState({});

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

  const handleTabOptionChange = (_, newValue) => {
    setTabOption(newValue);
  };

  const handleFetchVendibles = useCallback(async () => {
    if (tabOption === 'usuarios') {
      return;
    }
    const fetched = tabOption === 'productos' ? await fetchProductos() : await fetchServicios();
    setVendibles(fetched);
  }, [tabOption]);

  const onCategorySelected = (categoryId) => {
    if (!categoryId) {
      return handleFetchVendibles();
    }

    return setVendibles((current) => {
      const newVendibles = { ...current.vendibles };
      const vendiblesNames = Object.keys(current.vendibles);
      vendiblesNames.forEach((vendibleName) => {
        newVendibles[vendibleName] = newVendibles[vendibleName]
          .filter((vendible) => vendible.vendibleCategoryId === categoryId);
      });
      return { ...current, vendibles: { ...newVendibles } };
    });
  };

  useEffect(() => {
    handleFetchVendibles();
  }, [tabOption]);

  const propsForCurrentTabOption = useMemo(() => {
    const paramsDictionary = {
      usuarios: {
        usuarios: usuarioTypeFilter === USUARIO_TYPE_PROVEEDORES
          ? usuariosInfo.usuarios.proveedores : usuariosInfo.usuarios.clientes,
        usuarioTypeFilter,
        loginAsUser,
        deleteUser,
      },
      productos: {
        vendibles,
      },
      servicios: {
        vendibles,
      },
    };

    return paramsDictionary[tabOption];
  }, [tabOption, usuariosInfo, vendibles]);

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
          <Tabs value={tabOption} onChange={handleTabOptionChange}>
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
          {
            tabOption === 'usuarios' && (
              <Typography variant="h5">
                { sharedLabels.showing }
                {' '}
                { usuarioTypeFilter }
              </Typography>
            )
          }
        </Box>
        <Box display="flex" flexDirection="column" sx={{ marginTop: '2%' }}>
          <AdminFilters
            filtersType={tabOption}
            usuariosFiltersProps={{
              usuarioTypeFilter,
              setUsuarioTypeFilter: handleApplyUsuarioTypeFilter,
              filters,
              setFilters: handleSetFilters,
              applyFilters: handleApplyFilters,
              planesInfo,
            }}
            vendiblesFiltersProps={{
              categories: vendibles.categorias,
              onCategorySelected,
            }}
          />
          {TABS_COMPONENTS[tabOption](propsForCurrentTabOption)}
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
  fetchProductos: PropTypes.func.isRequired,
  fetchServicios: PropTypes.func.isRequired,
};

export default AdminPage;
