import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import Link from '@mui/material/Link';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Header from '../Header';
import UsuariosTable from './UsuariosTable';
import AdminFilters from './AdminFilters';
import { PAGE_SIZE, USUARIO_TYPE_PROVEEDORES } from '../Shared/Constants/System';
import { sharedLabels } from '../StaticData/Shared';
import { getUserInfoResponseShape } from '../Shared/PropTypes/Vendibles';
import { getUsuariosAdminResponseShape } from '../Shared/PropTypes/Admin';
import { planShape } from '../Shared/PropTypes/Proveedor';
import { menuOptionsShape } from '../Shared/PropTypes/Header';
import VendiblesTable from './VendiblesTable';
import ChangeRequestsTable from './ChangeRequestsTable';
import { flexColumn, flexRow } from '../Shared/Constants/Styles';

const TAB_VALUES = ['usuarios', 'productos', 'servicios', 'changeRequests'];

const TABS_LABELS = [sharedLabels.users,
  sharedLabels.products,
  sharedLabels.services,
  sharedLabels.changeRequests];

const TABS_COMPONENTS = {
  usuarios: (ref, props) => <UsuariosTable ref={ref} {...props} />,
  productos: (ref, props) => <VendiblesTable ref={ref} {...props} />,
  servicios: (ref, props) => <VendiblesTable ref={ref} {...props} />,
  changeRequests: (ref, props) => <ChangeRequestsTable ref={ref} {...props} />,
};

const filtersDefaultValues = {
  name: '', surname: '', email: '', showOnlyActives: false, plan: null,
};

function AdminPage({
  userInfo, usuariosInfo, planesInfo, deleteVendible, fetchPosts, getAllChangeRequests,
  menuOptions, applyFilters, loginAsUser, deleteUser, fetchProductos, fetchServicios,
  getChangeRequestDetail, confirmChangeRequest, updatePost, deleteChangeRequest,
}) {
  const [tabOption, setTabOption] = useState(TAB_VALUES[0]);
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState(USUARIO_TYPE_PROVEEDORES);

  const [filters, setFilters] = useState(filtersDefaultValues);

  const [vendibles, setVendibles] = useState({});
  const [posts, setPosts] = useState();
  const [changeRequests, setChangeRequests] = useState();

  const [isShowingVendiblePosts, setIsShowingVendiblePosts] = useState(false);
  const [vendibleChosen, setVendibleChosen] = useState({ id: null, name: null });

  const [paginationInfo, setPaginationInfo] = useState({
    page: 0,
  });

  const [priceSliderProps, setPriceSliderProps] = useState({
    min: undefined,
    max: undefined,
  });

  const tableContainerRef = useRef(null);

  const scroll = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = 200;
      tableContainerRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const ScrollingArrows = useCallback(() => (
    <Box sx={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      'z-index': 1000,
    }}
    >
      <IconButton onClick={() => scroll('left')} sx={{ bgcolor: 'white', boxShadow: 2 }}>
        <ChevronLeft />
      </IconButton>
      <IconButton onClick={() => scroll('right')} sx={{ bgcolor: 'white', boxShadow: 2 }}>
        <ChevronRight />
      </IconButton>
    </Box>
  ), [scroll]);

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

  const fetchChangeRequests = useCallback(async () => {
    const requests = await getAllChangeRequests();
    setChangeRequests(requests);
  }, [tabOption]);

  const filterVendiblesByName = (searchTerm) => (!searchTerm ? handleFetchVendibles()
    : setVendibles((previous) => {
      const regEx = new RegExp(searchTerm, 'i');
      const newVendibles = pickBy(previous.vendibles, (
        _,
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

  const handleDeleteVendible = (vendibleId) => deleteVendible(vendibleId).then(() => {
    setFilters({ ...filtersDefaultValues });
    handleFetchVendibles();
  });

  const handleApplyPostFilters = (newFilters) => fetchPosts({
    vendibleId: vendibleChosen.id,
    page: paginationInfo.page,
    pageSize: PAGE_SIZE,
    filters: newFilters,
  }).then(({ content: { content: innerContent } }) => {
    setPosts(innerContent);
  });

  useEffect(() => {
    if (tabOption === 'changeRequests') {
      fetchChangeRequests();
    }
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
      updatePost,
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
      changeRequests: {
        requests: changeRequests,
        getChangeRequestDetail,
        confirmChangeRequest: (id) => confirmChangeRequest(id).then(() => fetchChangeRequests()),
        deleteChangeRequest: (id) => deleteChangeRequest(id).then(() => fetchChangeRequests()),
        userToken: userInfo.token,
      },

    };

    return paramsDictionary[tabOption];
  }, [tabOption, usuariosInfo, vendibles, isShowingVendiblePosts,
    paginationInfo, posts, priceSliderProps, vendibleChosen, changeRequests]);

  return (
    <>
      <Header
        withMenuComponent
        renderNavigationLinks
        menuOptions={menuOptions}
        userInfo={userInfo}
      />
      <Box>
        <Box {...flexRow} justifyContent="space-between">
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
        <Box {...flexColumn} sx={{ marginTop: '2%' }}>
          <Box {...flexRow}>
            {
              tabOption !== 'changeRequests' && (
                <Box {...flexColumn}>
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
                    postsFiltersProps={{
                      onFilterSelected: handleApplyPostFilters,
                      page: paginationInfo.page,
                      vendibleType: tabOption,
                      priceSliderProps,
                    }}
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
                </Box>
              )
            }
          </Box>

          {TABS_COMPONENTS[tabOption](tableContainerRef, propsForCurrentTabOption)}
        </Box>
      </Box>
      <ScrollingArrows />
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
  getAllChangeRequests: PropTypes.func.isRequired,
  getChangeRequestDetail: PropTypes.func.isRequired,
  confirmChangeRequest: PropTypes.func.isRequired,
  deleteChangeRequest: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
};

export default AdminPage;
