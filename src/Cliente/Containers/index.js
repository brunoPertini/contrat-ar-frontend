import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState } from 'react';
import { withRouter } from '../../Shared/Components';
import Cliente from '../Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { routes } from '../../Shared/Constants';
import { resetUserInfo } from '../../State/Actions/usuario';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { CLIENTE } from '../../Shared/Constants/System';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';
import { getUserMenuOptions } from '../../Shared/Helpers/UtilsHelper';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ClienteContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const menuOptionsConfig = {
    myProfile: {
      props: userInfo,
    },
    logout: {
      onClick: () => setIsExitAppModalOpen(true),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  const dispatchHandleSearch = ({ searchType, searchInput, filters }) => {
    const httpClient = HttpClientFactory.createVendibleHttpClient(
      searchType,
      { token: userInfo.token },
    );

    return httpClient.getVendibleByFilters({ ...filters, nombre: searchInput })
      .catch((error) => {
        if (error.status && error.status === 401) {
          dispatch(resetUserInfo());
          window.location.href = routes.signin;
        }

        return error;
      });
  };

  if (userInfo.role !== CLIENTE) {
    throw new Response('', { status: 404 });
  }

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  return (
    <NavigationContextProvider>
      { ExitAppDialog }
      <Cliente
        userInfo={userInfo}
        menuOptions={menuOptions}
        dispatchHandleSearch={dispatchHandleSearch}
        handleLogout={handleLogout}
      />
    </NavigationContextProvider>
  );
}

export default withRouter(ClienteContainer);

ClienteContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
