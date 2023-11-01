import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from '../../Shared/Components';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import Cliente from '../Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { routes } from '../../Shared/Constants';
import { resetUserInfo } from '../../State/Actions/usuario';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ClienteContainer() {
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

  return <Cliente menuOptions={menuOptions} dispatchHandleSearch={dispatchHandleSearch} />;
}

export default withRouter(ClienteContainer);

ClienteContainer.propTypes = {
  router: PropTypes.shape({
    location: PropTypes.any,
    navigate: PropTypes.func,
    params: PropTypes.any,
  }).isRequired,
};
