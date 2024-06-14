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

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function AdminContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [usuariosInfo, setUsuariosInfo] = useState();

  const fetchFilteredUsuariosInfo = useCallback(async ({ type, filters }) => {
    const client = HttpClientFactory.createAdminHttpClient({
      token: userInfo.token,
      alternativeUrl: process.env.REACT_APP_ADMIN_BACKEND_URL,
    });

    const fetchedInfo = await client.getUsuariosByFilters(type, filters);

    setUsuariosInfo({ ...fetchedInfo });
  }, [setUsuariosInfo]);

  // First info fetching, with default values
  useEffect(() => {
    fetchFilteredUsuariosInfo({
      type: USUARIO_TYPE_PROVEEDORES,
      filters: { onlyActives: false },
    });
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
      menuOptions={menuOptions}
      applyFilters={fetchFilteredUsuariosInfo}
    />
  ) : null), [usuariosInfo]);

  return MemoizedAdminPage;
}

export default withRouter(AdminContainer);

AdminContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
