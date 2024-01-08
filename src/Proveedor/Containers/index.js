import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { UserAccountOptions, withRouter } from '../../Shared/Components';
import ProveedorPage from '../Components';
import { routes, systemConstants } from '../../Shared/Constants';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { resetUserInfo } from '../../State/Actions/usuario';
import { removeOnLeavingTabHandlers } from '../../Shared/Hooks/useOnLeavingTabHandler';
import { PRODUCTS, ROLE_PROVEEDOR_PRODUCTOS, SERVICES } from '../../Shared/Constants/System';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { routerShape } from '../../Shared/PropTypes/Shared';

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

const localStorageService = new LocalStorageService();

function ProveedorContainer({ router }) {
  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const [response, setResponse] = useState();

  const { role, token, id } = userInfo;

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo },
  }];

  const addVendibleLabel = addNewVendiblesLabels[role]?.label;
  const addVendibleLink = addNewVendiblesLabels[role]?.labelLink;

  const vendibleType = useMemo(() => (role === ROLE_PROVEEDOR_PRODUCTOS
    ? PRODUCTS : SERVICES), [role]);

  useEffect(() => {
    const backButtonPresed = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED,
    );
    if (!backButtonPresed && role.startsWith(systemConstants.PROVEEDOR)) {
      localStorageService.removeAllKeysOfPage(systemConstants.PROVEEDOR);
    }
  }, []);

  const handleUploadImage = (file) => {
    const client = HttpClientFactory.createVendibleHttpClient(vendibleType, {
      token,
    });

    return client.uploadImage(file, id);
  };

  const handleGetVendibles = async () => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
    });
    const newResponse = await client.getVendibles(id);
    setResponse(newResponse);
  };

  const handleLogout = async () => {
    removeOnLeavingTabHandlers();
    await dispatch(resetUserInfo());
    router.navigate(routes.signin);
  };

  const handlePostVendible = async (vendibleData) => {
    const client = HttpClientFactory.createProveedorHttpClient({
      token,
    });

    return client.postVendible({
      role,
      proveedorId: id,
      body: vendibleData,
    }).then((postVendibleResponse) => {
      handleGetVendibles();
      return postVendibleResponse;
    }).catch(() => {
      // Manejar caso de error
    });
  };

  useEffect(() => {
    handleGetVendibles();
  }, []);

  return !isEmpty(response) ? (
    <ProveedorPage
      vendibles={response.vendibles}
      categorias={response.categorias}
      menuOptions={menuOptions}
      addVendibleSectionProps={{ addVendibleLabel, addVendibleLink }}
      userInfo={userInfo}
      handleLogout={handleLogout}
      handleUploadImage={handleUploadImage}
      handlePostVendible={handlePostVendible}
      router={router}
    />
  ) : null;
}

ProveedorContainer.propTypes = {
  router: PropTypes.shape(routerShape).isRequired,
};

export default withRouter(ProveedorContainer);
