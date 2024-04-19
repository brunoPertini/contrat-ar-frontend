import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from '../../Shared/Components';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import Cliente from '../Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { routes } from '../../Shared/Constants';
import { resetUserInfo } from '../../State/Actions/usuario';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { CLIENTE } from '../../Shared/Constants/System';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ClienteContainer({ handleLogout }) {
  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const dispatchHandleSearch = ({ searchType, searchInput, filters }) => {
    const httpClient = HttpClientFactory.createVendibleHttpClient(
      searchType,
      { token: userInfo.token },
    );

    return httpClient.getVendibleByName(searchInput, filters)
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

  return (
    <NavigationContextProvider>
      <Cliente
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
