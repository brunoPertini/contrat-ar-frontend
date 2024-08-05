import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import { Link } from '@mui/material';
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

const PAGE_SIZE = 10;

function AdminPage({
  userInfo, usuariosInfo, planesInfo, deleteVendible, fetchPosts,
  menuOptions, applyFilters, loginAsUser, deleteUser, fetchProductos, fetchServicios,
}) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState(USUARIO_TYPE_PROVEEDORES);

  const [filters, setFilters] = useState(filtersDefaultValues);
  const [vendibles, setVendibles] = useState({});
  const [posts, setPosts] = useState();

  const [isShowingVendiblePosts, setIsShowingVendiblePosts] = useState(false);
  const [vendibleChosen, setVendibleChosen] = useState({ id: null, name: null });

  const [paginationInfo, setPaginationInfo] = useState({
    page: 0,
  });

  const [priceSliderProps, setPriceSliderProps] = useState({
    min: undefined,
    max: undefined,
  });

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

  const filterVendiblesByName = (searchTerm) => (!searchTerm ? handleFetchVendibles()
    : setVendibles((previous) => {
      const regEx = new RegExp(searchTerm, 'i');
      const newVendibles = pickBy(previous.vendibles, (
        vendibleName,
      ) => vendibleName.match(regEx));
      return { ...previous, vendibles: { ...newVendibles } };
    }));

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

  const handleDeleteVendible = (vendibleId) => deleteVendible(vendibleId).then(
    () => handleFetchVendibles(),
  );

  const handleApplyPostFilters = (newFilters) => fetchPosts({
    vendibleId: vendibleChosen.id,
    page: paginationInfo.page,
    pageSize: PAGE_SIZE,
    filters: newFilters,
  }).then(({ content: { content: innerContent } }) => {
    setPosts(innerContent);
  });

  useEffect(() => {
    handleFetchVendibles();
  }, [tabOption]);

  const propsForCurrentTabOption = useMemo(() => {
    const vendiblesProps = {
      fetchPosts: (params) => fetchPosts({ ...params, pageSize: PAGE_SIZE })
        .then((response) => {
          const { minPrice, maxPrice } = response;
          setPriceSliderProps({ min: minPrice, max: maxPrice });
          return response;
        }),
      vendibles,
      setIsShowingVendiblePosts,
      isShowingVendiblePosts,
      deleteVendible: handleDeleteVendible,
      vendibleType: tabOption,
      vendibleChosen,
      setVendibleChosen,
      paginationInfo,
      setPaginationInfo,
      posts,
      setPosts,
    };

    const paramsDictionary = {
      usuarios: {
        usuarios: usuarioTypeFilter === USUARIO_TYPE_PROVEEDORES
          ? usuariosInfo.usuarios.proveedores : usuariosInfo.usuarios.clientes,
        usuarioTypeFilter,
        loginAsUser,
        deleteUser,
      },
      productos: vendiblesProps,
      servicios: vendiblesProps,
    };

    return paramsDictionary[tabOption];
  }, [tabOption, usuariosInfo, vendibles, isShowingVendiblePosts,
    paginationInfo, posts, priceSliderProps]);

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
            isShowingVendiblePosts={isShowingVendiblePosts}
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
              onFilterByName: filterVendiblesByName,
            }}
            postsFiltersProps={
              {
                onFilterSelected: handleApplyPostFilters,
                page: paginationInfo.page,
                vendibleType: tabOption,
                priceSliderProps,
              }
            }
          />
          {
            isShowingVendiblePosts && (
            <Link
              id="closeVendiblePostsTable"
              component="button"
              variant="h5"
              onClick={() => setIsShowingVendiblePosts(false)}
              sx={{ cursor: 'pointer', width: '5%' }}
            >
              { sharedLabels.goBack }
            </Link>
            )
          }
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
  deleteVendible: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired,
};

export default AdminPage;
