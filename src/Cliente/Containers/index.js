/* eslint-disable no-unused-vars */
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

const mockProps = {
  dispatchHandleSearch: () => {},
  handleLogout: () => {},
  userInfo: {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    birthDate: '1990-01-01',
    location: {
      coordinates: [-34.9200364392778, -57.9542080490215],
    },
    role: 'CLIENTE',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    indexPage: '/cliente',
    phone: '+541100000000',
    password: 'securePassword123',
    plan: 'FREE',
    dni: '12345678',
    authorities: ['ROLE_CLIENTE'],
  },
};

function ClienteContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const menuOptionsConfig = {
    myProfile: {
      props: mockProps.userInfo,
    },
    logout: {
      onClick: () => setIsExitAppModalOpen(true),
    },
  };

  const menuOptions = getUserMenuOptions(menuOptionsConfig);

  const dispatchHandleSearch = ({ searchType, searchInput, filters }) => {
    const httpClient = HttpClientFactory.createVendibleHttpClient(
      searchType,
      { token: userInfo.token, handleLogout },
    );

    return httpClient.getVendibleByFilters({ ...filters, nombre: searchInput });
  };

  if (userInfo.role && userInfo.role !== CLIENTE) {
    throw new Response('', { status: 404 });
  }

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  return (
    <NavigationContextProvider>
      { ExitAppDialog }
      <Cliente
        menuOptions={menuOptions}
        {...mockProps}
      />
    </NavigationContextProvider>
  );
}

export default withRouter(ClienteContainer);

ClienteContainer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
