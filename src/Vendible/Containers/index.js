import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import VendiblePage from '../Components';
import { withRouter } from '../../Shared/Components';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

const stateSelector = (state) => state;

function VendibleContainer() {
  const location = useLocation();
  const { vendibleType, vendibleId } = location.state;

  const [proveedoresInfo, setProveedoresInfo] = useState();

  const userInfoSelector = createSelector(
    stateSelector,
    (state) => state.usuario,
  );

  const userInfo = useSelector(userInfoSelector);

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
    handleGetProveedoresInfo();
  }, []);

  return !isEmpty(proveedoresInfo) ? (
    <VendiblePage
      getVendibles={handleGetProveedoresInfo}
      proveedoresInfo={proveedoresInfo}
      vendibleType={vendibleType}
      userInfo={userInfo}
    />
  ) : null;
}

export default withRouter(VendibleContainer);
