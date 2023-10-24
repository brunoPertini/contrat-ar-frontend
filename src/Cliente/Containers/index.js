import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from '../../Shared/Components';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import Cliente from '../Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { routes } from '../../Shared/Constants';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ClienteContainer({ router }) {
  const userInfo = useSelector(userInfoSelector);
  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const dispatchHandleSearch = ({ searchType, searchInput }) => {
    const httpClient = HttpClientFactory.createVendibleHttpClient(
      searchType,
      { token: userInfo.token },
    );

    return httpClient.getVendibleByName(searchInput)
      .catch((error) => {
        if (error.status && error.status === 401) {
          router.navigate(routes.signin);
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
