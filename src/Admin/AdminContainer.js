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

  const fetchedFilteredUsuariosInfo = useCallback(async ({ type, filters }) => {
    const client = HttpClientFactory.createAdminHttpClient({ token: userInfo.token });

    const fetchedInfo = await client.getUsuariosByFilters(type, filters);

    setUsuariosInfo({ ...fetchedInfo });
  }, [setUsuariosInfo]);

  useEffect(() => {
    fetchedFilteredUsuariosInfo({ type: USUARIO_TYPE_PROVEEDORES });
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
      applyFilters={fetchedFilteredUsuariosInfo}
    />
  ) : null), [usuariosInfo]);

  return MemoizedAdminPage;
}

export default withRouter(AdminContainer);

AdminContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
