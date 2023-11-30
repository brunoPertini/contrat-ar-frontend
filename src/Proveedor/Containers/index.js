/* eslint-disable react/prop-types */
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { UserAccountOptions, withRouter } from '../../Shared/Components';
import ProveedorPage from '../Components';
import { routes, systemConstants } from '../../Shared/Constants';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { sharedLabels } from '../../StaticData/Shared';
import { resetUserInfo } from '../../State/Actions/usuario';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

const addNewVendiblesLabels = {
  [systemConstants.ROLE_PROVEEDOR_PRODUCTOS]: {
    label: proveedorLabels.addNewProductLabel,
    labelLink: proveedorLabels.addNewProductLinkLabel,
  },
  [systemConstants.ROLE_PROVEEDOR_SERVICIOS]: {
    label: proveedorLabels.addNewServiceLabel,
    labelLink: proveedorLabels.addNewServiceLinkLabel,
  },
};

function ProveedorContainer({ router }) {
  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const { role, token, id } = userInfo;

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const addVendibleLabel = addNewVendiblesLabels[role].label;
  const addVendibleLink = addNewVendiblesLabels[role].labelLink;

  const [response, setResponse] = useState();

  const handleGetVendibles = async () => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
    });
    const newResponse = await client.getVendibles(id);
    setResponse(newResponse);
  };

  const handleLogout = async () => {
    // TODO: moverlo a withRouter. Abstraer lo de localStorage de las claves harcodeadas
    await dispatch(resetUserInfo());
    router.navigate(routes.signin);
    localStorage.removeItem('backPressed');
    localStorage.removeItem('proveedor.page.screen');
  };

  useEffect(() => {
    handleGetVendibles();
    document.title = `${sharedLabels.siteName}|Proveedor`;
  }, []);

  return !isEmpty(response) ? (
    <ProveedorPage
      vendibles={response.vendibles}
      categorias={response.categorias}
      menuOptions={menuOptions}
      addVendibleSectionProps={{ addVendibleLabel, addVendibleLink }}
      userInfo={userInfo}
      handleLogout={handleLogout}
    />
  ) : null;
}

export default withRouter(ProveedorContainer);
