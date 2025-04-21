import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useState } from 'react';
import { withRouter } from '../../Shared/Components';
import Cliente from '../Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { CLIENTE } from '../../Shared/Constants/System';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';
import { getUserMenuOptions } from '../../Shared/Helpers/UtilsHelper';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ClienteContainer({ handleLogout, router: { navigate } }) {
  const userInfo = useSelector(userInfoSelector);

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

  const dispatchHandleSearch = ({ searchType, filters }) => {
    const httpClient = HttpClientFactory.createVendibleHttpClient(
      searchType,
      { token: userInfo.token, handleLogout },
    );

    return httpClient.getVendibleByFilters({ ...filters, nombre: filters.vendibleNombre });
  };

  if (userInfo.role && userInfo.role !== CLIENTE) {
    navigate('/error/404', { replace: true });
  }

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  return (
    <NavigationContextProvider>
      { ExitAppDialog }
      <Cliente
        menuOptions={menuOptions}
        userInfo={userInfo}
        dispatchHandleSearch={dispatchHandleSearch}
        handleLogout={handleLogout}
      />
    </NavigationContextProvider>
  );
}

export default withRouter(ClienteContainer);

ClienteContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};
