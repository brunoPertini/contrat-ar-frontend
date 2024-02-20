import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
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

  const handleGetProveedoresInfo = async () => {
    const httpClient = HttpClientFactory.createClienteHttpClient({ token: userInfo.token });
    return httpClient.getProveedoresInfoOfVendible(vendibleId).then((newProveedoresInfo) => {
      setProveedoresInfo(newProveedoresInfo);
    });
  };

  useEffect(() => {
    handleGetProveedoresInfo();
  }, []);

  return !isEmpty(proveedoresInfo) ? (
    <VendiblePage
      proveedoresInfo={proveedoresInfo}
      vendibleType={vendibleType}
      userInfo={userInfo}
      filtersEnabled={false}
    />
  ) : null;
}

export default withRouter(VendibleContainer);
