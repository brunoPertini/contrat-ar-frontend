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
  const [isError, setIsError] = useState(false);

  const [paginationInfo, setPaginationInfo] = useState({ pageable: { pageNumber: 0 } });

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
    page,
  ) => {
    const httpClient = HttpClientFactory.createClienteHttpClient({
      token: userInfo.token,
      handleLogout,
    });

    const resolvedPage = page !== undefined ? page : paginationInfo?.pageable?.pageNumber || 0;

    return httpClient.getProveedoresInfoOfVendible(
      vendibleId,
      filters,
      resolvedPage,
    )
      .then((response) => {
        setIsError(false);
        const newPaginationInfo = pickBy(response.vendibles, (_, key) => key !== 'content');
        const newProveedoresInfo = { ...response };

        setPaginationInfo((previous) => ({ ...previous, ...newPaginationInfo }));
        setProveedoresInfo(newProveedoresInfo);
        return Promise.resolve(!!(newProveedoresInfo?.vendibles?.content.length));
      })
      .catch(() => setIsError(true))
      .finally(() => window.scrollTo(0, 0));
  };

  useEffect(() => {
    handleGetProveedoresInfo();
  }, []);

  useOnLeavingTabHandler(waitAndCleanUserTokenCookie);

  return !isEmpty(proveedoresInfo) && !isError ? (
    <NavigationContextProvider>
      <VendiblePage
        handleLogout={handleLogout}
        getVendibles={handleGetProveedoresInfo}
        proveedoresInfo={proveedoresInfo}
        vendibleType={vendibleType}
        userInfo={userInfo}
        router={router}
        paginationInfo={paginationInfo}
        setPaginationInfo={setPaginationInfo}
      />
    </NavigationContextProvider>

  ) : null;
}

VendibleContainer.propTypes = {
  router: PropTypes.shape(routerShape).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(VendibleContainer);
