import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import VendiblePage from '../Components';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { NavigationContextProvider } from '../../State/Contexts/NavigationContext';
import { routerShape } from '../../Shared/PropTypes/Shared';
import { useOnLeavingTabHandler } from '../../Shared/Hooks/useOnLeavingTabHandler';
import { waitAndCleanUserTokenCookie } from '../../Shared/Helpers/UtilsHelper';

const stateSelector = (state) => state;

function VendibleContainer({ router, handleLogout }) {
  const location = useLocation();
  const { vendibleType, vendibleId } = location.state;

  const [proveedoresInfo, setProveedoresInfo] = useState();

  const [paginationInfo, setPaginationInfo] = useState({ page: 0, pageSize: 10 });

  const userInfoSelector = createSelector(
    stateSelector,
    (state) => state.usuario,
  );

  const userInfo = useSelector(userInfoSelector);

  /**
   *
   * @param {import('../Filters').ProveedoresVendiblesFiltersType} filters
   * @param {page: Number} page
   * @returns
   */
  const handleGetProveedoresInfo = async (
    filters,
    // eslint-disable-next-line no-unused-vars
    page = 0,
  ) => {
    const httpClient = HttpClientFactory.createClienteHttpClient({ token: userInfo.token });
    return httpClient.getProveedoresInfoOfVendible(
      vendibleId,
      filters,
      paginationInfo.page,
      paginationInfo.pageSize,
    )
      .then((response) => {
        const newPaginationInfo = pickBy(response.vendibles, (_, key) => key !== 'content');
        const newProveedoresInfo = { ...response };

        setPaginationInfo({ ...newPaginationInfo, page });
        setProveedoresInfo(newProveedoresInfo);
        return Promise.resolve(!!(newProveedoresInfo?.vendibles.length));
      })
      .catch(() => Promise.resolve(false));
  };

  useEffect(() => {
    handleGetProveedoresInfo();
  }, []);

  useOnLeavingTabHandler(waitAndCleanUserTokenCookie);

  return !isEmpty(proveedoresInfo) ? (
    <NavigationContextProvider>
      <VendiblePage
        handleLogout={handleLogout}
        getVendibles={handleGetProveedoresInfo}
        proveedoresInfo={proveedoresInfo}
        vendibleType={vendibleType}
        userInfo={userInfo}
        router={router}
        paginationInfo={paginationInfo}
      />
    </NavigationContextProvider>

  ) : null;
}

VendibleContainer.propTypes = {
  router: PropTypes.shape(routerShape).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(VendibleContainer);
