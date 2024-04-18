import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import VendiblePage from '../Components';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { routerShape } from '../../Shared/PropTypes/Shared';
import { useOnSaveDataBeforeLeaving } from '../../Shared/Hooks/useOnSaveDataBeforeLeaving';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { CLIENTE, PRODUCTS } from '../../Shared/Constants/System';

const stateSelector = (state) => state;

function VendibleContainer({ router }) {
  const location = useLocation();
  const { vendibleType, vendibleId } = location.state;

  const [proveedoresInfo, setProveedoresInfo] = useState();

  const userInfoSelector = createSelector(
    stateSelector,
    (state) => state.usuario,
  );

  const userInfo = useSelector(userInfoSelector);

  /**
   *
   * @param {import('../Filters').ProveedoresVendiblesFiltersType} filters
   * @returns
   */
  const handleGetProveedoresInfo = async (filters) => {
    const httpClient = HttpClientFactory.createClienteHttpClient({ token: userInfo.token });
    return httpClient.getProveedoresInfoOfVendible(vendibleId, filters)
      .then((newProveedoresInfo) => {
        setProveedoresInfo(newProveedoresInfo);
        return Promise.resolve(!!(newProveedoresInfo?.vendibles.length));
      })
      .catch(() => Promise.resolve(false));
  };

  useEffect(() => {
    if (userInfo.role !== CLIENTE) {
      throw new Response('', { status: 401 });
    }
    handleGetProveedoresInfo();
  }, []);

  return !isEmpty(proveedoresInfo) ? (
    <NavigationContextProvider>
      <VendiblePage
        getVendibles={handleGetProveedoresInfo}
        proveedoresInfo={proveedoresInfo}
        vendibleType={vendibleType}
        userInfo={userInfo}
        router={router}
      />
    </NavigationContextProvider>

  ) : null;
}

VendibleContainer.propTypes = {
  router: PropTypes.shape(routerShape).isRequired,
};

export default withRouter(VendibleContainer);
