import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import AdminPage from '.';
import { getUserMenuOptions } from '../Shared/Helpers/UtilsHelper';
import { withRouter } from '../Shared/Components';
import { HttpClientFactory } from '../Infrastructure/HttpClientFactory';
import { USUARIO_TYPE_PROVEEDORES } from '../Shared/Constants/System';
import { LocalStorageService } from '../Infrastructure/Services/LocalStorageService';
import { routes } from '../Shared/Constants';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const localStorageService = new LocalStorageService();

function AdminContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [usuariosInfo, setUsuariosInfo] = useState();

  const [planesInfo, setPlanesInfo] = useState();

  const fetchFilteredUsuariosInfo = useCallback(async ({ type, filters }) => {
    const client = HttpClientFactory.createAdminHttpClient({
      token: userInfo.token,
      alternativeUrl: process.env.REACT_APP_ADMIN_BACKEND_URL,
    });

    const fetchedInfo = await client.getUsuariosByFilters(type, filters);

    setUsuariosInfo({ ...fetchedInfo });
  }, [setUsuariosInfo]);

  const fetchPlanesInfo = useCallback(async () => {
    const client = HttpClientFactory.createProveedorHttpClient();
    const info = await client.getAllPlanes();
    setPlanesInfo([...info]);
  }, [setPlanesInfo]);

  const loginAsUser = useCallback(async (userId) => {
    const client = HttpClientFactory.createAdminHttpClient({
      token: userInfo.token,
      alternativeUrl: process.env.REACT_APP_ADMIN_BACKEND_URL,
    });

    const newUserInfo = await client.getUserInfoForLogin(userId);
    localStorageService.setItem(LocalStorageService.PAGES_KEYS.ADMIN.USER_INFO, { id: userId });
    window.location.href = routes[`ROLE_${newUserInfo.role.nombre}`];
  }, []);

  // First info fetching, with default values
  useEffect(() => {
    fetchFilteredUsuariosInfo({
      type: USUARIO_TYPE_PROVEEDORES,
      filters: { showOnlyActives: false },
    });
    fetchPlanesInfo();
  }, []);

  const menuOptionsConfig = {
    logout: {
      onClick: () => handleLogout(),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  const MemoizedAdminPage = useMemo(() => (usuariosInfo ? (
    <AdminPage
      userInfo={userInfo}
      usuariosInfo={usuariosInfo}
      planesInfo={planesInfo}
      menuOptions={menuOptions}
      applyFilters={fetchFilteredUsuariosInfo}
      loginAsUser={loginAsUser}
    />
  ) : null), [usuariosInfo, planesInfo]);

  return MemoizedAdminPage;
}

export default withRouter(AdminContainer);

AdminContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
