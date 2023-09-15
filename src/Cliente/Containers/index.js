import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from '../../Shared/Components';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import Cliente from '../Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ClienteContainer() {
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

    return httpClient.getVendibleByName(searchInput).catch((error) => {
      // TODO: resolver el caso de token expirado aca. Integrarlo con HttpClient.
      console.log(error);
    });
  };

  return <Cliente menuOptions={menuOptions} dispatchHandleSearch={dispatchHandleSearch} />;
}

export default withRouter(ClienteContainer);
